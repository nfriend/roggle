module Roggle {

	export interface RoggleHeaderProps {
		children?: any;
	}
	
	export interface RoggleHeaderState {
		currentUrl: string;
	}

	export class RoggleHeader extends React.Component<RoggleHeaderProps, RoggleHeaderState> {
		constructor(props: RoggleHeaderProps) {
			super(props);
			
			this.state = {
				currentUrl: null
			}
			
			$(window).on('roggle:joinedgame', () => {
				console.log("hash changed!");
				this.setState({
					currentUrl: window.location.href
				});
			});
		}

		render() {
			return (
				<div>
					<div className="title-container">
						<h1>Roggle</h1>
						<div>
							<div className="share-link-title">Invite people to this gameroom by sharing this URL: </div>
							<div className="cleared"></div>
							<div className="share-link">{this.state.currentUrl}&nbsp;&nbsp;</div>
						</div>
					</div>
					<div className="cleared"></div>
				</div>
			);
		}
	}
}