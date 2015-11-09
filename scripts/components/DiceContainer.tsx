module Roggle {

	export interface DiceContainerProps {
		letters?: Array<string>;
		children?: any;
	}
	
	export interface DiceContainerState {
	}

	export class DiceContainer extends React.Component<DiceContainerProps, DiceContainerState> {
		constructor(props: DiceContainerProps) {
			super(props);
		}

		render() {
			let letters = this.props.letters || [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
			
			let createDie = (letter: string, index: number) => {
				return <Die letter={letter} key={index} />
			};
			
			return (
				<div className="row roggle-row">
					{ letters.map(createDie) }
				</div>
			);
		}
	}
}