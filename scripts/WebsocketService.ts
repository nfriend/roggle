/// <reference path="../typings/jquery/jquery" />

module Roggle {

	export class WebsocketService {

		connection;
        _recieveHandlers = [];
		_errorHandlers = [];
		_connectHandlers = [];
		_disconnectHandlers = [];

        // used to differentiate between a disconnect and a failure to connect initially
        connectionWasOpen = false;

		connect = () => {
			if (document.location.hostname === 'nathanfriend.com' || document.location.hostname === 'nathanfriend.io' || document.location.hostname === 'nathanfriend.cloudapp.net') {
				this.connection = new WebSocket('wss://nathanfriend.io:18734/roggle/server', 'roggle-protocol')
			} else if (document.location.hostname === '13.84.128.73') {
				this.connection = new WebSocket('ws://13.84.128.73:18734/roggle/server', 'roggle-protocol');
            } else if (document.location.hostname === 'dev.nathanfriend.com' || document.location.hostname === 'dev.nathanfriend.io' || document.location.hostname === 'dev.nathanfriend.cloudapp.net') {
                this.connection = new WebSocket('wss://dev.nathanfriend.io:18734/roggle/server', 'roggle-protocol');
            } else {
                this.connection = new WebSocket('ws://127.0.0.1:18734', 'roggle-protocol');
            }

            this.connection.onopen = () => {
				this.connectionWasOpen = true;
				this._connectHandlers.forEach(function(element, index, array) { element(); });
            };
            this.connection.onclose = () => {
                if (this.connectionWasOpen) {
                    this._disconnectHandlers.forEach(function(element, index, array) { element(); });
                }
            };
            this.connection.onerror = () => {
                if (!this.connectionWasOpen) {
					this._errorHandlers.forEach(function(element, index, array) { element(); });
                }
            };
            this.connection.onmessage = (message) => {
				try {
					var data = JSON.parse(message.data);
				} catch (e) {
					console.log('Roggle: websocketConnection service: failed to JSON.parse data: ' + data);
					this._errorHandlers.forEach(function(element, index, array) { element(data); });
				}

				this._recieveHandlers.forEach(function(element, index, array) { element(data); });
            };
		}

		send = (data) => {
			if (this.connection) {
				this.connection.send(JSON.stringify(data));
			}
		}

		on = (eventType, handler) => {
			if (eventType === 'receive') {
				this._recieveHandlers.push(handler);
			} else if (eventType === 'error') {
				this._errorHandlers.push(handler);
			} else if (eventType === 'connect') {
				this._connectHandlers.push(handler);
			} else if (eventType === 'disconnect') {
				this._disconnectHandlers.push(handler);
			}
		}

		off = (eventType, handler) => {
			if (eventType === 'recieve') {
				if (this._recieveHandlers.indexOf(handler) === -1) {
					return false;
				} else {
					this._recieveHandlers.splice(this._recieveHandlers.indexOf(handler), 1);
					return true;
				}
			} else if (eventType === 'error') {
				if (this._errorHandlers.indexOf(handler) === -1) {
					return false;
				} else {
					this._errorHandlers.splice(this._errorHandlers.indexOf(handler), 1);
					return true;
				}
			} else if (eventType === 'connect') {
				if (this._connectHandlers.indexOf(handler) === -1) {
					return false;
				} else {
					this._connectHandlers.splice(this._connectHandlers.indexOf(handler), 1);
					return true;
				}
			} else if (eventType === 'disconnect') {
				if (this._disconnectHandlers.indexOf(handler) === -1) {
					return false;
				} else {
					this._disconnectHandlers.splice(this._disconnectHandlers.indexOf(handler), 1);
					return true;
				}
			}
		}
	}
}