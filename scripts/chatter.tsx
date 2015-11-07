/// <reference path="../typings/react/react" />
/// <reference path="../typings/react-dom/react-dom" />
/// <reference path="../typings/jquery/jquery" />
/// <reference path="./Components/CommentBox" />

module Chatter {
    ReactDOM.render(
        <CommentBox url="/api/comments" pollInterval={2000} />,
        document.getElementById('content')
    );
}