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
							<div className="share-link">{this.state.currentUrl}</div>
						</div>
						<div className="media-link-container">
							<a className="media-link email-link" href="mailto:roggle@nathanfriend.io?subject=Roggle">
								<i className="fa fa-envelope-square" />
							</a>
							<a className="media-link linkedin-link" href="http://www.linkedin.com/in/nfriend">
								<i className="fa fa-linkedin-square" />
							</a>
							<a className="media-link googleplus-link" href="https://plus.google.com/100251709863074180329/posts">
								<i className="fa fa-google-plus-square" />
							</a>
							<a className="media-link facebook-link" href="https://twitter.com/NathanAFriend">
								<i className="fa fa-twitter-square" />
							</a>
							<a className="media-link facebook-link" href="https://www.facebook.com/nathan.friend">
								<i className="fa fa-facebook-square" />
							</a>
							<a className="media-link github-link" href="https://github.com/nfriend/roggle">
								<i className="fa fa-github-square" />
							</a>
						</div>
					</div>
					<div className="cleared"></div>
				</div>
			);
		}
	}
}