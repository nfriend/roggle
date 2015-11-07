/// <reference path="../typings/jquery/jquery" />

module Roggle {
	let websocketService = new WebsocketService();
	let dieShuffler = new DieShuffler();
	let audio = new Audio('./audio/diceroll.mp3');
	let gameIdUrlRegex = /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$)/i;

	websocketService.connect();
	websocketService.on('receive', (data: Array<string>) => {
		setDice(data);
	});
	websocketService.on('connect', () => {
		var gameIdMatches = gameIdUrlRegex.exec(window.location.href);
		var gameId = gameIdMatches ? gameIdMatches[0] : getGuid(); 

		console.log('gameId: ' + gameId);

		websocketService.send({
			messageType: 'join',
			gameId: gameId
		});
		
		window.history.pushState(null, "", "#/" + gameId)
	});

	$('#shake-button').click(() => {
		var randomizedDice = dieShuffler.Randomize();
		setDice(randomizedDice);
		websocketService.send(randomizedDice);
	});

	function setDice(dice: Array<string>) {
		$('.roggle-die').each((i, elem) => {
			$(elem).html(dice[i]);
		});

		audio.play();
	}

	// from http://stackoverflow.com/a/2117523/1063392
	function getGuid(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
}