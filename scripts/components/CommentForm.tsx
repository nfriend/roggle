module Chatter {
	
	export interface CommentFormProps {
		onCommentSubmit: (comment: { author: string; text: string; }) => void;
	}
	
	export class CommentForm extends React.Component<CommentFormProps, any> {
		constructor(props:CommentFormProps) {
			super(props);
		}
		
		handleSubmit = (e) => {
			e.preventDefault();
			let author = this.refs.author.value.trim();
			let text = this.refs.text.value.trim();
			if (!text || !author) {
				return;
			}
			this.props.onCommentSubmit({ author: author, text: text });
			this.refs.author.value = '';
			this.refs.text.value = '';
			return;
		};
		
		refs: {
			[key: string]: any;
			author: HTMLInputElement;
			text: HTMLInputElement;
		}
		
		render() {
			return (
				<form className="comment-form col-sm-6 col-md-5 col-lg-4" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label>Your name</label>
						<input className="form-control" type="text" placeholder="Your name" ref="author" />
					</div>
					<div className="form-group">
						<label>Your comment</label>
						<input className="form-control" type="text" placeholder="Say something..." ref="text" />
					</div>
					<div className="form-group">
						<input className="form-control btn btn-primary" type="submit" value="Post" />
					</div>
				</form>
			);
		}
	}
}