/// <reference path="../typings/jquery/jquery" />

module Roggle {

	export class DieShuffler {

		Dice = [
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

		Randomize(): Array<string> {
			return this.shuffleArray(this.Dice.map(die => {
				return die[this.getRandomInt(0, 5)];
			}));
		}

		// from http://stackoverflow.com/a/1527820/1063392
		private getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		// from http://stackoverflow.com/a/2450976/1063392
		private shuffleArray(array) {
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
		}
	}
}