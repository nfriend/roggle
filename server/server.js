'use strict';

var WebSocketServer = require('websocket').server;
var http = require('http');
var gameToClients = {};
var allowedOrigins = [
    /^https?:\/\/localhost/, 
    /^https?:\/\/127.0.0.1/, 
    /^https?:\/\/13.84.128.73/, 
    /^https?:\/\/nathanfriend.com/, 
    /^https?:\/\/www.nathanfriend.com/, 
    /^https?:\/\/nathanfriend.io/, 
    /^https?:\/\/www.nathanfriend.io/, 
    /^https?:\/\/dev.nathanfriend.com/, 
    /^https?:\/\/dev.nathanfriend.io/, 
    /^https?:\/\/nathanfriend.cloudapp.net/, 
    /^https?:\/\/www.nathanfriend.cloudapp.net/
];

var server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(18734, function () {
    console.log((new Date()) + ' Server is listening on port 18734');
});

var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept('roggle-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            var parsedMessage = JSON.parse(message.utf8Data);

            if (parsedMessage.messageType === 'join') {

                if (!gameToClients[parsedMessage.gameId]) {
                    // if this is a new game
                    
                    gameToClients[parsedMessage.gameId] = [];

                    connection.sendUTF(JSON.stringify({
                        messageType: 'initiate'
                    }));
                } else {
                    // if this client is joining an existing game
                    
                    connection.sendUTF(JSON.stringify({
                        messageType: 'setDice',
                        letters: gameToClients[parsedMessage.gameId].letters
                    }));
                }
                gameToClients[parsedMessage.gameId].push(connection);
                connection.gameId = parsedMessage.gameId;
            } else if (parsedMessage.messageType === 'setDice') {
                gameToClients[connection.gameId].letters = parsedMessage.letters;
                gameToClients[connection.gameId].forEach(function (client, index, array) {
                    if (client !== connection) {
                        client.sendUTF(JSON.stringify({
                            messageType: 'setDice',
                            letters: parsedMessage.letters
                        }));
                    }
                });
            }
        }
        else if (message.type === 'binary') {
            console.log('recieved unsupported binary message type. message ignored.');
        }
    });

    connection.on('close', function (reasonCode, description) {
        var gameClients = gameToClients[connection.gameId];

        if (gameClients) {
            gameClients.splice(gameClients.indexOf(connection), 1);
            if (gameClients.length === 0) {
                delete gameClients[connection.gameId];
            }
        }
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function originIsAllowed(origin) {
    var isAllowed = false;
    allowedOrigins.forEach(function (element, index, array) {
        if (element.test(origin)) {
            isAllowed = true;
        }
    });

    return isAllowed;
}