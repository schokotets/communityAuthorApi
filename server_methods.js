/*
 *Function used to check wether a specific word needs a space in front of given word
 */
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

module.exports = {"needSpace": needSpace};