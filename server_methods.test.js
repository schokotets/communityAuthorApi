const serverFunctions = require('./server_methods.js')

describe('needSpace()', () =>{
	test('needs Space before "a"', () => {
		expect(serverFunctions.needSpace("He likes", "a")).toBe(true);
	})

	test('no Space before ","', () =>{
		expect(serverFunctions.needSpace("He likes", ",")).toBe(false);
	})

	test('needs Space before first \'"\'', () =>{
		expect(serverFunctions.needSpace("He says:", "\"")).toBe(true);
	})

	test('no Space before second \'"\'', () =>{
		expect(serverFunctions.needSpace("He explained: \"This is how.", "\"")).toBe(false);
	})
})

describe('isBanned()', () =>{
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

	test('detects banned single word with random upper or lower case', () => {
		expect(serverFunctions.isBanned("Beginning of the storry, and ", ["BANNED_WORD"], "BaNnEd_WORD")).toBe(true);
	})
})

describe('padWord()', () => {
	test('pads word with space', () => {
		expect(serverFunctions.padWord("Die Geschichte", "beginnt")).toBe(" beginnt");
	})
	test('doesn\'t pad "." with space', () => {
		expect(serverFunctions.padWord("Die Geschichte", ".")).toBe(".");
	})
})