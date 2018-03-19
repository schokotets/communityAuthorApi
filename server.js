const express = require('express');
const json = require('express-json');
const app = express();

const serverMethods = require("./server_methods.js")

app.use(json());
app.use(express.json())

let gameStatus = {
  story: "",
  bannedStrings: [],
  votingQueue: {}
}

app.get('/story', function (req, res) {
  res.end(gameStatus.story);
});

app.get('/queue', function (req, res) {
  res.end(gameStatus.votingQueue);
});

app.post('/submit', function (req, res) {
  let word = req.body.word.trim();
  let uuid = req.body.uuid;
  if(word.match(/([\s]+)/g) != null) {
    res.status(403).end();
  } else {
    gameStatus.votingQueue[uuid] = addWordToVoting(gameStatus, uuid, word);
    res.status(200).send(word);
  }
});


var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Server listening at http://%s:%s", host, port);
});
