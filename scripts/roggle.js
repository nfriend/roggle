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
})(Roggle || (Roggle = {}));
/// <reference path="../utility" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Roggle;
(function (Roggle) {
    var Die = (function (_super) {
        __extends(Die, _super);
        function Die(props) {
            _super.call(this, props);
            this.allLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Qu", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            this.state = {
                displayLetter: props.letter
            };
            this.animateLetter();
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
            this.animateLetter();
            console.log('here');
        };
        Die.prototype.render = function () {
            if (!this.state) {
                var content = null;
            }
            else {
                var content = this.state.displayLetter;
            }
            return (React.createElement("div", {"className": "col-xs-3 roggle-cell"}, React.createElement("div", {"className": "roggle-die"}, content)));
        };
        return Die;
    })(React.Component);
    Roggle.Die = Die;
})(Roggle || (Roggle = {}));
var Roggle;
(function (Roggle) {
    var DiceContainer = (function (_super) {
        __extends(DiceContainer, _super);
        function DiceContainer(props) {
            var _this = this;
            _super.call(this, props);
            this.buttonClicked = function () {
                console.log('clicked');
                _this.setState({
                    letters: ["Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z"]
                });
            };
            this.state = {
                letters: props.letters
            };
        }
        DiceContainer.prototype.render = function () {
            var createDie = function (letter, index) {
                return React.createElement(Roggle.Die, {"letter": letter});
            };
            return (React.createElement("div", {"className": "row roggle-row"}, this.state.letters.map(createDie), React.createElement("button", {"onClick": this.buttonClicked}, "Change to Z's")));
        };
        return DiceContainer;
    })(React.Component);
    Roggle.DiceContainer = DiceContainer;
})(Roggle || (Roggle = {}));
/// <reference path="../typings/react/react" />
/// <reference path="../typings/react-dom/react-dom" />
/// <reference path="../typings/jquery/jquery" />
/// <reference path="./components/Die" />
/// <reference path="./components/DiceContainer" />
var Roggle;
(function (Roggle) {
    var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"];
    ReactDOM.render(React.createElement(Roggle.DiceContainer, {"letters": letters}), document.getElementById('react-container'));
})(Roggle || (Roggle = {}));
//# sourceMappingURL=roggle.js.map