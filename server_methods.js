/*
 *Function used to check wether a specific word needs a space in front of given word
 */
function needSpace(story, word) {
 	if(story.length === 0)
 		return false;

  word.replace(new RegExp('\"', 'g'), '"');

 	if(['.','!','?',',',':',';',')'].includes(word.charAt(0)))
 	return false;

 	if(story.endsWith('('))
 		return false;

 	if((story.match('"') || []).length%2 == 1 && word.startsWith('"'))
 		return false;

 	if((story.match('"') || []).length%2 == 1 && story.endsWith('"'))
 		return false;

 	return true;
}

function padWord(gameStatus, word){
 	let story = gameStatus.story;
 	if(needSpace(story, word))
 		return " " + word
 	return word;
}

function isBanned(gameStatus, word){
 	let story = gameStatus.story;
 	let bannedStrings = gameStatus.bannedStrings;
 	for (let i = 0; i < bannedStrings.length; i++) {
 		let string = story + word;
 		if(string.toUpperCase().indexOf(bannedStrings[i].toUpperCase()) !== -1)
 			return true;
 	}
 	return false;
}

function continueStory(gameStatus) {
  gameStatus.story += padWord(gameStatus, mostPopular(gameStatus.votingResult));
}

function mostPopular(map) {
  if(!map || !Object.keys(map).length) return "";
  return Object.keys(map).reduce((a, b) => map[a] > map[b] ? a : b);
}

function addWordToVoting(gameStatus, uuid, word){
 	let story = gameStatus.story;
 	if(isBanned(gameStatus, word))
 		return;
 	gameStatus.votingQueue[uuid] = word;
  //TODO change later - it won't be tested
  if(!(word in gameStatus.votingResult))
    gameStatus.votingResult[word] = 0;
}

function voteFor(gameStatus, uuid, id){
  //TODO no voting twice per uuid (via votingQueue)
  gameStatus.votingResult[Object.keys(gameStatus.votingResult)[id]]++;
}

function reset(gameStatus, hard) {
  if(hard){
    gameStatus.story = "";
    gameStatus.bannedStrings = {};
  }
  gameStatus.votingQueue = {};
  gameStatus.votingResult = {};
  gameStatus.voting = false;
}

module.exports = {
 	"needSpace": needSpace,
 	"padWord": padWord,
 	"isBanned": isBanned,
  "continueStory": continueStory,
  "mostPopular": mostPopular,
 	"addWordToVoting": addWordToVoting,
  "voteFor": voteFor,
  "reset": reset
};
