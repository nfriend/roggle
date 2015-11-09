/// <reference path="../typings/react/react" />
/// <reference path="../typings/react-dom/react-dom" />
/// <reference path="../typings/jquery/jquery" />
/// <reference path="./components/Die" />
/// <reference path="./components/DiceContainer" />
/// <reference path="./components/RoggleContainer" />
/// <reference path="./components/RoggleHeader" />

module Roggle {
	ReactDOM.render(
		<RoggleContainer />,
		document.getElementById('react-container')
	);
}