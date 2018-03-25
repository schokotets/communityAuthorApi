const express = require('express');
const json = require('body-parser').json;
const app = express();

const serverMethods = require("./server_methods.js");
addWordToVoting = serverMethods.addWordToVoting;
needSpace = serverMethods.needSpace;

app.use(json());
// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);
    // Pass to next layer of middleware
    next();
});


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
  console.log("Request made.");
  let word = req.body.word.trim();
  let uuid = req.body.uuid;
  if(word.match(/([\s]+)/g) != null) {
    res.status(403).end();
  } else {
    //addWordToVoting(gameStatus, uuid, word);
    // For testing purposes:
    if(word == "clear") {
      gameStatus.story = "";
      console.log("Cleared the story");
      res.status(200).end();
    } else {
      let spaced = (needSpace(gameStatus.story, word)?" ":"") + word;
      gameStatus.story += spaced;
      console.log("Word submitted: \"" + spaced + "\"")
      res.status(200).send(spaced);
    }
  }
});
