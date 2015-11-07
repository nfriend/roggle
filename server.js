var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var COMMENTS_FILE = path.join(__dirname, 'comments.json');

function getGuid() {
  
  // from http://stackoverflow.com/a/2117523/1063392
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/comments', function (req, res) {
  fs.readFile(COMMENTS_FILE, function (err, data) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/api/comments', function (req, res) {
  fs.readFile(COMMENTS_FILE, function (err, data) {
    var comments = JSON.parse(data);
    var newComment = req.body;
    newComment.id = getGuid(); 
    comments.push(newComment);
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function (err) {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(comments);
    });
  });
});

app.delete('/api/comments/:commentId', function(req, res) {
  fs.readFile(COMMENTS_FILE, function (err, data) {
    var comments = JSON.parse(data);
    var commentToRemove = comments.filter(function(comment) {
      return comment.id === req.params.commentId;
    })[0];
    if (commentToRemove) {
      var indexToRemove = comments.indexOf(commentToRemove);
      comments.splice(indexToRemove, 1);  
    }
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function (err) {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(comments);
    });
  });
});


app.listen(app.get('port'), function () {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
