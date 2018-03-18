/*
 *Function used to check wether a specific word needs a space in front of given word
 */
function needSpace(story, word) {
  if(story.length === 0)
  	return false;

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

/*
 *Function used to check wether a specific word is banned
 */ 
function isBanned(story, bannedStrings, word){
	for (let i = 0; i < bannedStrings.length; i++) {
		let string = story + word;
		if(string.toUpperCase().indexOf(bannedStrings[i].toUpperCase()) !== -1)
			return true;
	}
	return false;
}

function padWord(story, word){
	if(needSpace(story, word))
		return " " + word
	return word;
}

module.exports = {"needSpace": needSpace, "isBanned": isBanned, "padWord": padWord};