var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="../typings/jquery/jquery" />
var Roggle;
(function (Roggle) {
    var DieShuffler = /** @class */ (function () {
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
    }());
    Roggle.DieShuffler = DieShuffler;
})(Roggle || (Roggle = {}));
/// <reference path="../typings/jquery/jquery" />
var Roggle;
(function (Roggle) {
    var WebsocketService = /** @class */ (function () {
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
                    _this.connection = new WebSocket('wss://nathanfriend.io:18734/roggle/server', 'roggle-protocol');
                }
                else if (document.location.hostname === '13.84.128.73') {
                    _this.connection = new WebSocket('ws://13.84.128.73:18734/roggle/server', 'roggle-protocol');
                }
                else if (document.location.hostname === 'dev.nathanfriend.com' || document.location.hostname === 'dev.nathanfriend.io' || document.location.hostname === 'dev.nathanfriend.cloudapp.net') {
                    _this.connection = new WebSocket('wss://dev.nathanfriend.io:18734/roggle/server', 'roggle-protocol');
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
    }());
    Roggle.WebsocketService = WebsocketService;
})(Roggle || (Roggle = {}));
var Roggle;
(function (Roggle) {
    // from http://stackoverflow.com/a/1527820/1063392
    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    */
    function GetRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    Roggle.GetRandomArbitrary = GetRandomArbitrary;
    // from http://stackoverflow.com/a/1527820/1063392
    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    function GetRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    Roggle.GetRandomInt = GetRandomInt;
    // from http://stackoverflow.com/a/2117523/1063392
    function GetGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    Roggle.GetGuid = GetGuid;
})(Roggle || (Roggle = {}));
/// <reference path="../utility" />
var Roggle;
(function (Roggle) {
    var Die = /** @class */ (function (_super) {
        __extends(Die, _super);
        function Die(props) {
            var _this = _super.call(this, props) || this;
            _this.allLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Qu", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            _this.state = {
                displayLetter: props.letter
            };
            return _this;
        }
        Die.prototype.animateLetter = function () {
            var _this = this;
            var scheduleDisplayLetterChange = function (i, isFinalLetter) {
                var timeToWait = isFinalLetter ? 1423 + Math.random() * 250 : (Math.pow(1.02, i * 3) - 1) * 1000 + ((Math.random() - .5) * 250);
                var letterToDisplay = isFinalLetter ? _this.props.letter : _this.allLetters[Roggle.GetRandomInt(0, 25)];
                setTimeout(function () {
                    _this.setState({
                        displayLetter: letterToDisplay
                    });
                }, timeToWait);
            };
            for (var i = 0; i < 15; i++) {
                scheduleDisplayLetterChange(i, i === 14);
            }
        };
        Die.prototype.componentWillReceiveProps = function (nextProps) {
            var _this = this;
            setTimeout(function () {
                _this.animateLetter();
            }, 0);
        };
        Die.prototype.render = function () {
            if (!this.state) {
                var content = null;
            }
            else {
                var content = this.state.displayLetter;
            }
            return (React.createElement("div", { className: "col-xs-3 roggle-cell" },
                React.createElement("div", { className: "roggle-die" }, content)));
        };
        return Die;
    }(React.Component));
    Roggle.Die = Die;
})(Roggle || (Roggle = {}));
var Roggle;
(function (Roggle) {
    var DiceContainer = /** @class */ (function (_super) {
        __extends(DiceContainer, _super);
        function DiceContainer(props) {
            return _super.call(this, props) || this;
        }
        DiceContainer.prototype.render = function () {
            var letters = this.props.letters || [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
            var createDie = function (letter, index) {
                return React.createElement(Roggle.Die, { letter: letter, key: index });
            };
            return (React.createElement("div", { className: "row roggle-row" }, letters.map(createDie)));
        };
        return DiceContainer;
    }(React.Component));
    Roggle.DiceContainer = DiceContainer;
})(Roggle || (Roggle = {}));
var Roggle;
(function (Roggle) {
    var RoggleContainer = /** @class */ (function (_super) {
        __extends(RoggleContainer, _super);
        function RoggleContainer(props) {
            var _this = _super.call(this, props) || this;
            _this.webSocketService = new Roggle.WebsocketService();
            _this.dieShuffler = new Roggle.DieShuffler();
            _this.audio = new Audio('./audio/diceroll.mp3');
            _this.gameIdUrlRegex = /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$)/i;
            _this.onWebsocketServiceConnect = function () {
                var gameIdMatches = _this.gameIdUrlRegex.exec(window.location.href);
                var gameId = gameIdMatches ? gameIdMatches[1] : Roggle.GetGuid();
                _this.webSocketService.send({
                    messageType: 'join',
                    gameId: gameId,
                });
                window.history.pushState(null, '', '#/' + gameId);
                $(window).trigger('roggle:joinedgame');
            };
            _this.onWebSocketServiceReceive = function (message) {
                console.log('messageReceived: ', message);
                if (message.messageType === 'setDice') {
                    console.log('setDice: ', message.letters);
                    _this.setDice(message.letters);
                }
                else if (message.messageType === 'initiate') {
                    console.log('initiate');
                    _this.shakeItUp();
                }
            };
            _this.setDice = function (newLetters) {
                console.log('setting: ', newLetters);
                _this.audio
                    .play()
                    .catch(function (err) {
                    return console.log('Browser has autoplay disabled; skipping sound effect.');
                });
                _this.setState({
                    letters: newLetters,
                });
            };
            _this.shakeItUp = function () {
                var newLetters = _this.dieShuffler.Randomize();
                _this.setDice(newLetters);
                _this.webSocketService.send({
                    messageType: 'setDice',
                    letters: newLetters,
                });
            };
            _this.state = {
                letters: null,
            };
            _this.webSocketService.on('connect', _this.onWebsocketServiceConnect);
            _this.webSocketService.on('receive', _this.onWebSocketServiceReceive);
            _this.webSocketService.connect();
            return _this;
        }
        RoggleContainer.prototype.render = function () {
            return (React.createElement("div", { className: "container" },
                React.createElement(Roggle.RoggleHeader, null),
                React.createElement("hr", null),
                React.createElement(Roggle.DiceContainer, { letters: this.state.letters }),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("button", { className: "btn btn-lg btn-default", onClick: this.shakeItUp }, "Shake it up!")));
        };
        return RoggleContainer;
    }(React.Component));
    Roggle.RoggleContainer = RoggleContainer;
})(Roggle || (Roggle = {}));
var Roggle;
(function (Roggle) {
    var RoggleHeader = /** @class */ (function (_super) {
        __extends(RoggleHeader, _super);
        function RoggleHeader(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {
                currentUrl: null
            };
            $(window).on('roggle:joinedgame', function () {
                console.log("hash changed!");
                _this.setState({
                    currentUrl: window.location.href
                });
            });
            return _this;
        }
        RoggleHeader.prototype.render = function () {
            return (React.createElement("div", null,
                React.createElement("div", { className: "title-container" },
                    React.createElement("h1", null, "Roggle"),
                    React.createElement("div", null,
                        React.createElement("div", { className: "share-link-title" }, "Invite people to this gameroom by sharing this URL: "),
                        React.createElement("div", { className: "cleared" }),
                        React.createElement("div", { className: "share-link" }, this.state.currentUrl)),
                    React.createElement("div", { className: "media-link-container" },
                        React.createElement("a", { className: "media-link email-link", href: "mailto:roggle@nathanfriend.io?subject=Roggle" },
                            React.createElement("i", { className: "fa fa-envelope-square" })),
                        React.createElement("a", { className: "media-link linkedin-link", href: "http://www.linkedin.com/in/nfriend" },
                            React.createElement("i", { className: "fa fa-linkedin-square" })),
                        React.createElement("a", { className: "media-link googleplus-link", href: "https://plus.google.com/100251709863074180329/posts" },
                            React.createElement("i", { className: "fa fa-google-plus-square" })),
                        React.createElement("a", { className: "media-link facebook-link", href: "https://twitter.com/NathanAFriend" },
                            React.createElement("i", { className: "fa fa-twitter-square" })),
                        React.createElement("a", { className: "media-link facebook-link", href: "https://www.facebook.com/nathan.friend" },
                            React.createElement("i", { className: "fa fa-facebook-square" })),
                        React.createElement("a", { className: "media-link github-link", href: "https://github.com/nfriend/roggle" },
                            React.createElement("i", { className: "fa fa-github-square" })))),
                React.createElement("div", { className: "cleared" })));
        };
        return RoggleHeader;
    }(React.Component));
    Roggle.RoggleHeader = RoggleHeader;
})(Roggle || (Roggle = {}));
/// <reference path="../typings/react/react" />
/// <reference path="../typings/react-dom/react-dom" />
/// <reference path="../typings/jquery/jquery" />
/// <reference path="./components/Die" />
/// <reference path="./components/DiceContainer" />
/// <reference path="./components/RoggleContainer" />
/// <reference path="./components/RoggleHeader" />
var Roggle;
(function (Roggle) {
    ReactDOM.render(React.createElement(Roggle.RoggleContainer, null), document.getElementById('react-container'));
})(Roggle || (Roggle = {}));
//# sourceMappingURL=roggle.js.map