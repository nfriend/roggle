module Roggle {
	// from http://stackoverflow.com/a/1527820/1063392
	/**
	* Returns a random number between min (inclusive) and max (exclusive)
	*/
	export function GetRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	}

	// from http://stackoverflow.com/a/1527820/1063392
	/**
	 * Returns a random integer between min (inclusive) and max (inclusive)
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	export function GetRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	// from http://stackoverflow.com/a/2117523/1063392
	export function GetGuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
}