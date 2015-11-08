/// <reference path="../utility" />

module Roggle {

	export interface DieProps {
		letter: string;
		children?: any;
	}

	export class Die extends React.Component<DieProps, any> {
		
		private allLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Qu", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

		constructor(props: DieProps) {
			super(props);

			this.state = {
				displayLetter: props.letter
			}

			this.animateLetter();
		}

		animateLetter() {
			var scheduleDisplayLetterChange = (i: number, isFinalLetter: boolean) => {
				var timeToWait = isFinalLetter ? 1423 + Math.random() * 250 : (Math.pow(1.02, i * 3) - 1) * 1000 + ((Math.random() - .5) * 250);
				var letterToDisplay = isFinalLetter ? this.props.letter : this.allLetters[GetRandomInt(0, 25)];
				
				setTimeout(() => {
					this.setState({
						displayLetter: letterToDisplay
					});
				}, timeToWait);
			}

			for (var i = 0; i < 15; i++) {
				scheduleDisplayLetterChange(i, i === 14);
			}
		}

		componentWillReceiveProps(nextProps: DieProps) {
			this.animateLetter();
			console.log('here');
		}

		render() {

			if (!this.state) {
				var content: any = null;
			} else {
				var content: any = this.state.displayLetter;
			}

			return (
				<div className="col-xs-3 roggle-cell">
					<div className="roggle-die">
						{content}
						</div>
					</div>
			);
		}
	}
}