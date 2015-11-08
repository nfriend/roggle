/// <reference path="../typings/react/react" />
/// <reference path="../typings/react-dom/react-dom" />
/// <reference path="../typings/jquery/jquery" />
/// <reference path="./components/Die" />
/// <reference path="./components/DiceContainer" />

module Roggle {
	let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"];
	
	ReactDOM.render(
		<DiceContainer letters={letters} />,
		document.getElementById('react-container')
	);
}