/// <reference path="../../typings/marked/marked" />

module Chatter {
	
	export interface CommentProps {
		author: string;
		id: string;
		children?: any;
		
		onCommentDelete: (commentId: string) => void;
	}
	
	export class Comment extends React.Component<CommentProps, any> {
		
		constructor(props:CommentProps) {
			super(props);
		}
		
		rawMarkup() {
			let rawMarkup = marked(this.props.children.toString(), {sanitize: true});
			return { __html: rawMarkup };
		}
		
		deleteThisComment = () => {
			this.props.onCommentDelete(this.props.id);
		}
		
		render() {
			return (
				<div className="comment col-xs-12">
					<h4 className="comment-author">
						{this.props.author}
					</h2>
					<button className="delete-comment-button btn btn-default btn-xs" onClick={this.deleteThisComment}>delete</button>
					<div className="clearfix" />
					<i className="fa fa-caret-right comment-caret" />
					<span className="comment-content" dangerouslySetInnerHTML={this.rawMarkup()} />
					<div className="clearfix" />
					<br />
				</div>
			);
		}
	}
}