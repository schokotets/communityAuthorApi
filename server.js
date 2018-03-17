var express = require('express');
var app = express();
var fs = require("fs");

app.use(express.json());

story = "";

function needSpace(story, word) {
  if(story.length === 0) return false;
  if(['.','!','?',',',':',';',')'].includes(word.charAt(0)))
    return false;
  if(story.endsWith('(')) return false;
  if((story.match('"') || []).length%2 == 1 && word.startsWith('"'))
    return false;
  if((story.match('"') || []).length%2 == 1 && story.endsWith('"'))
    return false;
  return true;
}

app.get('/story', function (req, res) {
  res.end(story);
});

app.post('/submit', function (req, res) {
  let word = req.body.word.trim();
  if(word.match(/([\s]+)/g) != null)
    res.status(403).end();
  else {
    story += (needSpace(story, word)?" ":"") + word;
    res.status(200).send(word);
  }
});

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

});