const serverFunctions = require('./server_methods.js')

describe('needSpace()', () => {
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

describe('padWord()', () => {
	test('pads word with space', () => {
		let gameStatus = {
			story: "Die Geschichte",
			bannedStrings: ["BANNED_WORD"],
			votingQueue: {},
			votingResult: {}
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

describe('isBanned()', () => {
	test('detects banned single word', () => {
		let gameStatus = {
			story: "Beginning of the storry, and ",
			bannedStrings: ["BANNED_WORD"],
			votingQueue: {},
			votingResult: {}
		}
		expect(serverFunctions.isBanned(gameStatus, "BANNED_WORD")).toBe(true);
	})

	test('does not prevent allowed single word', () => {
		let gameStatus = {
			story: "Beginning of the storry, and ",
			bannedStrings: ["BANNED_WORD"],
			votingQueue: {},
			votingResult: {}
		}
		expect(serverFunctions.isBanned(gameStatus, "ALLOWED_WORD")).toBe(false);
	})

	test('detects banned phrase (Phrase given as new word)', () => {
		let gameStatus = {
			story: "Beginning of the storry, and BANNED ",
			bannedStrings: ["BANNED WORD"],
			votingQueue: {},
			votingResult: {}
		}
		expect(serverFunctions.isBanned(gameStatus, "WORD")).toBe(true);
	})

	test('detects banned phrase (Phrase given as new word)', () => {
		let gameStatus = {
			story: "Beginning of the storry, and ",
			bannedStrings: ["BANNED WORD"],
			votingQueue: {},
			votingResult: {}
		}
		expect(serverFunctions.isBanned(gameStatus, "BANNED WORD")).toBe(true);
	})

	test('detects banned single word with random upper or lower case', () => {
		let gameStatus = {
			story: "Beginning of the storry, and ",
			bannedStrings: ["BANNED_WORD"],
			votingQueue: {},
			votingResult: {}
		}
		expect(serverFunctions.isBanned(gameStatus, "BaNnEd_WORD")).toBe(true);
	})
})

describe('mostPopular()', () => {
	test('finds first word', () => {
		let map = {"word1": 4, "word2": 0, "word3": 2};
		expect(serverFunctions.mostPopular(map)).toEqual("word1");
	})
	test('finds second word', () => {
		let map = {"word1": 3, "word2": 7, "word3": 1};
		expect(serverFunctions.mostPopular(map)).toEqual("word2");
	})
	test('deals with empty map', () => {
		let map = {};
		expect(serverFunctions.mostPopular(map)).toEqual("");
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

describe('voteFor()', () => {
	test('votes for existing word', () => {
			let gameStatus = {
				votingResult: {
					"word1": 3,
					"word2": 1
				}
			}
			serverFunctions.voteFor(gameStatus, "uuid", 1);
			expect(gameStatus.votingResult).toEqual({"word1": 3, "word2": 2})
	})
	test('can\'t vote for empty result list', () => {
			let gameStatus = {
				votingResult: {}
			}
			serverFunctions.voteFor(gameStatus, "uuid", 1);
			expect(gameStatus.votingResult).toEqual({})
	})
})

describe('reset()', () => {
	test('resets soft', () => {
		let gameStatus = {
			voting: true,
			story: "A story",
			bannedStrings: ["BAnNeD"],
			votingQueue: {"uuid": "word"},
			votingResult: {"word": 4}
		}
		serverFunctions.reset(gameStatus, false);
		expect(gameStatus.story).toEqual("A story");
		expect(gameStatus.voting).toBeFalsy();
		expect(gameStatus.votingQueue).toEqual({});
		expect(gameStatus.votingResult).toEqual({});
		expect(gameStatus.bannedStrings).toEqual(["BAnNeD"]);
	})
	test('resets hard', () => {
		let gameStatus = {
			voting: true,
			story: "A story",
			bannedStrings: ["BAnNeD"],
			votingQueue: {"uuid": "word"},
			votingResult: {"word": 4}
		}
		serverFunctions.reset(gameStatus, true);
		expect(gameStatus.story).toEqual("");
		expect(gameStatus.voting).toBeFalsy();
		expect(gameStatus.votingQueue).toEqual({});
		expect(gameStatus.votingResult).toEqual({});
		expect(gameStatus.bannedStrings).toEqual({});
	})
})
