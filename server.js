var express = require('express');
var json = require('express-json');
var app = express();
var fs = require("fs");

const serverMethods = require("./server_methods.js")

app.use(json());

story = "";

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