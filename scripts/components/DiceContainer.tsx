module Roggle {

	export interface DiceContainerProps {
		letters: Array<string>;
		children?: any;
	}
	
	export interface DiceContainerState {
		letters: Array<string>;
	}

	export class DiceContainer extends React.Component<DiceContainerProps, DiceContainerProps> {
		constructor(props: DiceContainerProps) {
			super(props);
			
			this.state = {
				letters: props.letters
			};
		}
		
		buttonClicked = () => {
			console.log('clicked');
			this.setState({
				letters: ["Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z", "Z"]
			});
		}

		render() {
			let createDie = (letter: string, index: number) => {
				return <Die letter={letter} />
			};
			
			return (
				<div className="row roggle-row">
					{this.state.letters.map(createDie) }
					<button onClick={this.buttonClicked}>Change to Z's</button>
				</div>
			);
		}
	}
}