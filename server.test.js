const serverFunctions = require('./server_methods.js')

test('needs Space before "a"', () => {
	expect(serverFunctions.needSpace("He likes", "a")).toBe(true);
})

test('needs Space before ","', () =>{
	expect(serverFunctions.needSpace("He likes", ",")).toBe(false);
})

test('detects banned single word', () => {
	expect(serverFunctions.isBanned("Beginning of the storry, and ", ["BANNED_WORD"], "BANNED_WORD")).toBe(true);
})

test('does not prevent allowed single word', () => {
	expect(serverFunctions.isBanned("Beginning of the storry, and ", ["BANNED_WORD"], "ALLOWED_WORD")).toBe(false);
})

test('detects banned phrase (Phrase given as new word)', () => {
	expect(serverFunctions.isBanned("Beginning of the storry, and BANNED ", ["BANNED WORD"], "WORD")).toBe(true);
})

test('detects banned phrase (Phrase given as new word)', () => {
	expect(serverFunctions.isBanned("Beginning of the storry, and ", ["BANNED WORD"], "BANNED WORD")).toBe(true);
})