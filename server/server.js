'use strict';

var WebSocketServer = require('websocket').server;
var http = require('http');
var clients = [];
var allowedOrigins = [/^http:\/\/localhost/, /^http:\/\/127.0.0.1/, /^http:\/\/nathanfriend.com/, /^http:\/\/www.nathanfriend.com/, /^http:\/\/nathanfriend.io/, /^http:\/\/www.nathanfriend.io/, /^http:\/\/dev.nathanfriend.com/, /^http:\/\/dev.nathanfriend.io/, /^http:\/\/nathanfriend.cloudapp.net/, /^http:\/\/www.nathanfriend.cloudapp.net/];

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
    clients.push(connection);
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);

            clients.forEach(function (element, index, array) {
                if (element !== connection) {
                    element.sendUTF(message.utf8Data);
                }
            });
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');

            clients.forEach(function (element, index, array) {
                if (element !== connection) {
                    element.sendBytes(message.binaryData);
                }
            });
        }
    });

    connection.on('close', function (reasonCode, description) {
        clients.splice(clients.indexOf(connection), 1);
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