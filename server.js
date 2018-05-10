const express = require('express');
const json = require('body-parser').json;
const app = express();

const serverMethods = require("./server_methods.js");
needSpace = serverMethods.needSpace;
continueStory = serverMethods.continueStory;
addWordToVoting = serverMethods.addWordToVoting;
voteFor = serverMethods.voteFor;
gameLoop = serverMethods.gameLoop;
switchAble = serverMethods.switchAble;
toggle = serverMethods.toggle;
reset = serverMethods.reset;

let gameStatus = {
  voting: false,
  story: "",
  bannedStrings: [],
  votingQueue: {}, //uuid -> word / uuid -> id
  votingResult: {} //word -> n
}

let switchStatus = {
  afterTime: 20, //Time in seconds. If 0 don't switch after time
  retryTime: 5,
  minimumWords: 2,
  minimumVotes: 1
}

if(switchStatus.afterTime > 0) {
  switchStatus.nextSwitch = Date.now() + switchStatus.afterTime*1000;
  setTimeout(serverMethods.gameLoop, switchStatus.afterTime*1000, gameStatus, switchStatus);
}

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


var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Server listening at http://%s:%s", host, port);
});

// for testing purposes
app.put('/reset', function (req, res) {
  reset(gameStatus, true);
  res.status(200).end();
});

// for testing purposes
app.put('/toggle', function (req, res) {
  toggle(gameStatus);
  res.status(200).send("voting: " + gameStatus.voting);
});

app.get('/status', function(req, res) {
  let response = {
    voting: gameStatus.voting ? true : false
  }
  if(!switchAble(gameStatus, switchStatus)){
    response.waiting = {
      done: false,
      value: Object.keys(gameStatus.votingQueue).length,
      required: gameStatus.voting?switchStatus.minimumVotes:switchStatus.minimumWords
    }
  } else {
    response.waiting = {
      done: true,
      countdown: switchStatus.nextSwitch - Date.now()
    }
  }
  res.json(response).end();
});

app.get('/queue', function (req, res) {
  if(gameStatus.voting)
    res.json(gameStatus.votingResult).end();
  else res.status(403).end();
});

app.post('/vote', function (req, res) {
  if(gameStatus.voting) {
    let uuid = req.body.uuid;
    let id = req.body.id;
    voteFor(gameStatus, uuid, id);
    res.status(200).end();
  } else {
    res.status(403).end();
  }
});

app.get('/story', function (req, res) {
  res.send(gameStatus.story);
});

app.post('/submit', function (req, res) {
  if(!gameStatus.voting) {
    let word = req.body.word.trim();
    let uuid = req.body.uuid;
    if(word.match(/([\s]+)/g) != null) {
      res.status(403).end();
    } else {
      addWordToVoting(gameStatus, uuid, word);
      console.log('Word submitted: "' + word + '"')
      res.status(200).send(word);
    }
  } else {
    res.status(403).end();
  }
});
