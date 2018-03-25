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
		let gameStatus = {
			story: "Beginning of the storry, and ",
			bannedStrings: ["BANNED_WORD"],
			votingQueue: {}
		}
		expect(serverFunctions.isBanned(gameStatus, "BANNED_WORD")).toBe(true);
	})

	test('does not prevent allowed single word', () => {
		let gameStatus = {
			story: "Beginning of the storry, and ",
			bannedStrings: ["BANNED_WORD"],
			votingQueue: {}
		}
		expect(serverFunctions.isBanned(gameStatus, "ALLOWED_WORD")).toBe(false);
	})

	test('detects banned phrase (Phrase given as new word)', () => {
		let gameStatus = {
			story: "Beginning of the storry, and BANNED ",
			bannedStrings: ["BANNED WORD"],
			votingQueue: {}
		}
		expect(serverFunctions.isBanned(gameStatus, "WORD")).toBe(true);
	})

	test('detects banned phrase (Phrase given as new word)', () => {
		let gameStatus = {
			story: "Beginning of the storry, and ",
			bannedStrings: ["BANNED WORD"],
			votingQueue: {}
		}
		expect(serverFunctions.isBanned(gameStatus, "BANNED WORD")).toBe(true);
	})

	test('detects banned single word with random upper or lower case', () => {
		let gameStatus = {
			story: "Beginning of the storry, and ",
			bannedStrings: ["BANNED_WORD"],
			votingQueue: {}
		}
		expect(serverFunctions.isBanned(gameStatus, "BaNnEd_WORD")).toBe(true);
	})
})

describe('padWord()', () => {
	test('pads word with space', () => {
		let gameStatus = {
			story: "Die Geschichte",
			bannedStrings: ["BANNED_WORD"],
			votingQueue: {}
		}
		expect(serverFunctions.padWord(gameStatus, "beginnt")).toBe(" beginnt");
	})
	test('doesn\'t pad "." with space', () => {
		let gameStatus = {
			story: "Die Geschichte",
			bannedStrings: ["BANNED_WORD"],
			votingQueue: {},
			votingResult: {}
		}
		expect(serverFunctions.padWord(gameStatus, ".")).toBe(".");
	})
})

describe('addWordToVoting()', () => {
	test('adds allowed word', () => {
		let gameStatus = {
			story: "Die Geschichte beginnt mit",
			bannedStrings: ["BAnNeD"],
			votingQueue: {},
			votingResult: {}
		}
		serverFunctions.addWordToVoting(gameStatus, "uuidTest", "einem");
		expect(gameStatus.votingQueue).toEqual({"uuidTest": "einem"});
	})

	test('prevents disallowed word', () => {
		let gameStatus = {
			story: "Die Geschichte beginnt mit",
			bannedStrings: ["BAnNeD"],
			votingQueue: {},
			votingResult: {}
		}
		serverFunctions.addWordToVoting(gameStatus, "uuidTest", "banned");
		expect(gameStatus.votingQueue).toEqual({});
	})
})
