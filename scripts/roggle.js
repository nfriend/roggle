/// <reference path="../typings/jquery/jquery" />
var Roggle;
(function (Roggle) {
    var DieShuffler = (function () {
        function DieShuffler() {
            this.Dice = [
                ['A', 'E', 'A', 'N', 'E', 'G'],
                ['W', 'N', 'G', 'E', 'E', 'H'],
                ['A', 'H', 'S', 'P', 'C', 'O'],
                ['L', 'N', 'H', 'N', 'R', 'Z'],
                ['A', 'S', 'P', 'F', 'F', 'K'],
                ['T', 'S', 'T', 'I', 'Y', 'D'],
                ['O', 'B', 'J', 'O', 'A', 'B'],
                ['O', 'W', 'T', 'O', 'A', 'T'],
                ['I', 'O', 'T', 'M', 'U', 'C'],
                ['E', 'R', 'T', 'T', 'Y', 'L'],
                ['R', 'Y', 'V', 'D', 'E', 'L'],
                ['T', 'O', 'E', 'S', 'S', 'I'],
                ['L', 'R', 'E', 'I', 'X', 'D'],
                ['T', 'E', 'R', 'W', 'H', 'V'],
                ['E', 'I', 'U', 'N', 'E', 'S'],
                ['N', 'U', 'I', 'H', 'M', 'Qu']
            ];
        }
        DieShuffler.prototype.Randomize = function () {
            var _this = this;
            return this.shuffleArray(this.Dice.map(function (die) {
                return die[_this.getRandomInt(0, 5)];
            }));
        };
        // from http://stackoverflow.com/a/1527820/1063392
        DieShuffler.prototype.getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        // from http://stackoverflow.com/a/2450976/1063392
        DieShuffler.prototype.shuffleArray = function (array) {
            var currentIndex = array.length, temporaryValue, randomIndex;
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        };
        return DieShuffler;
    })();
    Roggle.DieShuffler = DieShuffler;
})(Roggle || (Roggle = {}));
/// <reference path="../typings/jquery/jquery" />
var Roggle;
(function (Roggle) {
    var WebsocketService = (function () {
        function WebsocketService() {
            var _this = this;
            this._recieveHandlers = [];
            this._errorHandlers = [];
            this._connectHandlers = [];
            this._disconnectHandlers = [];
            // used to differentiate between a disconnect and a failure to connect initially
            this.connectionWasOpen = false;
            this.connect = function () {
                if (document.location.hostname === 'nathanfriend.com' || document.location.hostname === 'nathanfriend.io' || document.location.hostname === 'nathanfriend.cloudapp.net') {
                    _this.connection = new WebSocket('ws://nathanfriend.io:18734/roggle/server', 'roggle-protocol');
                }
                else if (document.location.hostname === 'dev.nathanfriend.com' || document.location.hostname === 'dev.nathanfriend.io' || document.location.hostname === 'dev.nathanfriend.cloudapp.net') {
                    _this.connection = new WebSocket('ws://dev.nathanfriend.io:18734/roggle/server', 'roggle-protocol');
                }
                else {
                    _this.connection = new WebSocket('ws://127.0.0.1:18734', 'roggle-protocol');
                }
                _this.connection.onopen = function () {
                    _this.connectionWasOpen = true;
                    _this._connectHandlers.forEach(function (element, index, array) { element(); });
                };
                _this.connection.onclose = function () {
                    if (_this.connectionWasOpen) {
                        _this._disconnectHandlers.forEach(function (element, index, array) { element(); });
                    }
                };
                _this.connection.onerror = function () {
                    if (!_this.connectionWasOpen) {
                        _this._errorHandlers.forEach(function (element, index, array) { element(); });
                    }
                };
                _this.connection.onmessage = function (message) {
                    try {
                        var data = JSON.parse(message.data);
                    }
                    catch (e) {
                        console.log('Roggle: websocketConnection service: failed to JSON.parse data: ' + data);
                        _this._errorHandlers.forEach(function (element, index, array) { element(data); });
                    }
                    _this._recieveHandlers.forEach(function (element, index, array) { element(data); });
                };
            };
            this.send = function (data) {
                if (_this.connection) {
                    _this.connection.send(JSON.stringify(data));
                }
            };
            this.on = function (eventType, handler) {
                if (eventType === 'receive') {
                    _this._recieveHandlers.push(handler);
                }
                else if (eventType === 'error') {
                    _this._errorHandlers.push(handler);
                }
                else if (eventType === 'connect') {
                    _this._connectHandlers.push(handler);
                }
                else if (eventType === 'disconnect') {
                    _this._disconnectHandlers.push(handler);
                }
            };
            this.off = function (eventType, handler) {
                if (eventType === 'recieve') {
                    if (_this._recieveHandlers.indexOf(handler) === -1) {
                        return false;
                    }
                    else {
                        _this._recieveHandlers.splice(_this._recieveHandlers.indexOf(handler), 1);
                        return true;
                    }
                }
                else if (eventType === 'error') {
                    if (_this._errorHandlers.indexOf(handler) === -1) {
                        return false;
                    }
                    else {
                        _this._errorHandlers.splice(_this._errorHandlers.indexOf(handler), 1);
                        return true;
                    }
                }
                else if (eventType === 'connect') {
                    if (_this._connectHandlers.indexOf(handler) === -1) {
                        return false;
                    }
                    else {
                        _this._connectHandlers.splice(_this._connectHandlers.indexOf(handler), 1);
                        return true;
                    }
                }
                else if (eventType === 'disconnect') {
                    if (_this._disconnectHandlers.indexOf(handler) === -1) {
                        return false;
                    }
                    else {
                        _this._disconnectHandlers.splice(_this._disconnectHandlers.indexOf(handler), 1);
                        return true;
                    }
                }
            };
        }
        return WebsocketService;
    })();
    Roggle.WebsocketService = WebsocketService;
})(Roggle || (Roggle = {}));
/// <reference path="../typings/jquery/jquery" />
var Roggle;
(function (Roggle) {
    var websocketService = new Roggle.WebsocketService();
    var dieShuffler = new Roggle.DieShuffler();
    var audio = new Audio('./audio/diceroll.mp3');
    var gameIdUrlRegex = /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$)/i;
    websocketService.connect();
    websocketService.on('receive', function (data) {
        setDice(data);
    });
    websocketService.on('connect', function () {
        var gameIdMatches = gameIdUrlRegex.exec(window.location.href);
        var gameId = gameIdMatches ? gameIdMatches[0] : getGuid();
        console.log('gameId: ' + gameId);
        websocketService.send({
            messageType: 'join',
            gameId: gameId
        });
        window.history.pushState(null, "", "#/" + gameId);
    });
    $('#shake-button').click(function () {
        var randomizedDice = dieShuffler.Randomize();
        setDice(randomizedDice);
        websocketService.send(randomizedDice);
    });
    function setDice(dice) {
        $('.roggle-die').each(function (i, elem) {
            $(elem).html(dice[i]);
        });
        audio.play();
    }
    // from http://stackoverflow.com/a/2117523/1063392
    function getGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
})(Roggle || (Roggle = {}));
//# sourceMappingURL=roggle.js.map