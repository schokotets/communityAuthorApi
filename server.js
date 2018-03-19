const express = require('express');
const json = require('body-parser').json;
const app = express();

const serverMethods = require("./server_methods.js");
addWordToVoting = serverMethods.addWordToVoting;

app.use(json());

let gameStatus = {
  story: "",
  bannedStrings: [],
  votingQueue: {}
}

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Server listening at http://%s:%s", host, port);
});

app.get('/story', function (req, res) {
  res.end(gameStatus.story);
});

app.get('/queue', function (req, res) {
  res.end(JSON.stringify(gameStatus.votingQueue));
});

app.post('/submit', function (req, res) {
  let word = req.body.word.trim();
  let uuid = req.body.uuid;
  if(word.match(/([\s]+)/g) != null) {
    res.status(403).end();
  } else {
    addWordToVoting(gameStatus, uuid, word);
    res.status(200).send(word);
  }
});



