/// <reference path="../typings/jquery/jquery" />

module Roggle {
	let websocketService = new WebsocketService();
	let dieShuffler = new DieShuffler();
	let audio = new Audio('./audio/diceroll.mp3');
	
	websocketService.connect();
	websocketService.on('receive', (data: Array<string>) => {
		setDice(data);
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
}