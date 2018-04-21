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
			bannedStrings: [],
			votingQueue: {},
			votingResult: {}
		}
		expect(serverFunctions.padWord(gameStatus, "beginnt")).toBe(" beginnt");
	})
	test('doesn\'t pad "." with space', () => {
		let gameStatus = {
			story: "Die Geschichte",
			bannedStrings: [],
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

describe('continueStory()', () => {
	test('continues Story', () => {
			let gameStatus = {
				story: "The story",
				bannedStrings: [],
				votingQueue: {},
				votingResult: {"word1": 5, "word2": 7}
			}
			serverFunctions.continueStory(gameStatus);
			expect(gameStatus.story).toEqual("The story word2");
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
	test('votes for the first time', () => {
			let gameStatus = {
				votingQueue: { "uuid1": 0, "uuid2": 0, "uuid3": 1, "uuid4": 0 },
				votingResult: { "word1": 3, "word2": 1 }
			}
			serverFunctions.voteFor(gameStatus, "uuid", 1);
			expect(gameStatus.votingResult).toEqual({"word1": 3, "word2": 2})
			expect(gameStatus.votingQueue).toEqual(
				{ "uuid1": 0, "uuid2": 0, "uuid3": 1, "uuid4": 0, "uuid": 1 }
			)
	})
	test('change vote', () => {
			let gameStatus = {
				votingQueue: { "uuid1": 0, "uuid2": 1, "uuid": 0 },
				votingResult: { "word1": 2, "word2": 1 }
			}
			serverFunctions.voteFor(gameStatus, "uuid", 1);
			expect(gameStatus.votingQueue).toEqual({"uuid1": 0, "uuid2": 1, "uuid": 1})
			expect(gameStatus.votingResult).toEqual({"word1": 1, "word2": 2})
	})
	test('same vote', () => {
			let gameStatus = {
				votingQueue: { "uuid1": 0, "uuid2": 1, "uuid": 0 },
				votingResult: { "word1": 2, "word2": 1}
			}
			serverFunctions.voteFor(gameStatus, "uuid", 0);
			expect(gameStatus.votingQueue).toEqual({"uuid1": 0, "uuid2": 1, "uuid": 0})
			expect(gameStatus.votingResult).toEqual({"word1": 2, "word2": 1})
	})
	test('empty list', () => {
			let gameStatus = {
				votingQueue: {},
				votingResult: {}
			}
			serverFunctions.voteFor(gameStatus, "uuid", 1);
			expect(gameStatus.votingResult).toEqual({})
	})
	test('too big id', () => {
			let gameStatus = {
				votingQueue: { "uuid1": 0, "uuid2": 1, "uuid3": 1 },
				votingResult: { "word1": 1, "word2": 2 }
			}
			serverFunctions.voteFor(gameStatus, "uuid", 2);
			expect(gameStatus.votingQueue).toEqual({"uuid1": 0, "uuid2": 1, "uuid3": 1})
			expect(gameStatus.votingResult).toEqual({"word1": 1, "word2": 2})
	})
	test('too small id', () => {
			let gameStatus = {
				votingQueue: { "uuid1": 0, "uuid2": 1, "uuid3": 1 },
				votingResult: { "word1": 1, "word2": 2 }
			}
			serverFunctions.voteFor(gameStatus, "uuid", -2);
			expect(gameStatus.votingQueue).toEqual({"uuid1": 0, "uuid2": 1, "uuid3": 1})
			expect(gameStatus.votingResult).toEqual({"word1": 1, "word2": 2})
	})
})

describe('gameLoop()', () => {
	test('still voting', () => {
		jest.useFakeTimers();
		let gameStatus = {
			voting: true,
			story: "",
			bannedStrings: [],
			votingQueue: {},
			votingResult: {}
		}
		let switchStatus = {
			afterTime: 20,
			retryTime: 5,
			minimumWords: 2
		}
		serverFunctions.gameLoop(gameStatus, switchStatus);
		expect(gameStatus.voting).toBeFalsy();
		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenLastCalledWith(serverFunctions.gameLoop, switchStatus.afterTime*1000, gameStatus, switchStatus);
		jest.clearAllTimers()
	})
	test('wait for enough entries', () => {
		jest.useFakeTimers();
		let gameStatus = {
			voting: false,
			story: "",
			bannedStrings: [],
			votingQueue: {},
			votingResult: {}
		}
		let switchStatus = {
			afterTime: 20,
			retryTime: 5,
			minimumWords: 2
		}
		serverFunctions.gameLoop(gameStatus, switchStatus);
		expect(gameStatus.voting).toBeFalsy();
		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenLastCalledWith(serverFunctions.gameLoop, switchStatus.retryTime*1000, gameStatus, switchStatus);
		jest.clearAllTimers()
	})
	test('enough words submitted', () => {
		jest.useFakeTimers();
		let gameStatus = {
			voting: false,
			story: "",
			bannedStrings: [],
			votingQueue: {"uuid1": 0, "uuid2": 1},
			votingResult: {}
		}
		let switchStatus = {
			afterTime: 20,
			retryTime: 5,
			minimumWords: 2
		}
		serverFunctions.gameLoop(gameStatus, switchStatus);
		expect(gameStatus.voting).toBeTruthy();
		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenLastCalledWith(serverFunctions.gameLoop, switchStatus.afterTime*1000, gameStatus, switchStatus);
		jest.clearAllTimers()
	})
})

describe('toggle()', () => {
	test('voting is over', () => {
		let gameStatus = {
			voting: true,
			story: "A story",
			bannedStrings: ["BANNED_WORD"],
			votingQueue: {"uuid1": 2, "uuid2": 2, "uuid3": 1},
			votingResult: {"word0": 0, "word1": 1, "word2": 2}
		}
		serverFunctions.toggle(gameStatus);
		expect(gameStatus.voting).toBeFalsy();
		expect(gameStatus.story).toEqual("A story word2");
		expect(gameStatus.bannedStrings).toEqual(["BANNED_WORD"]);
		expect(gameStatus.votingQueue).toEqual({});
		expect(gameStatus.votingResult).toEqual({});
	})
	test('submitting is over, different words', () => {
		let gameStatus = {
			voting: false,
			story: "A story",
			bannedStrings: ["BANNED_WORD"],
			votingQueue: {"uuid1": "word0", "uuid2": "word1", "uuid3": "word2"},
			votingResult: {}
		}
		serverFunctions.toggle(gameStatus);
		expect(gameStatus.voting).toBeTruthy();
		expect(gameStatus.story).toEqual("A story");
		expect(gameStatus.bannedStrings).toEqual(["BANNED_WORD"]);
		expect(gameStatus.votingQueue).toEqual({});
		expect(gameStatus.votingResult).toEqual({"word0": 0, "word1": 0, "word2": 0});
	})

	test('submitting is over, same word', () => {
			let gameStatus = {
				voting: false,
				story: "A story",
				bannedStrings: ["BANNED_WORD"],
				votingQueue: {"uuid1": "word2", "uuid2": "word1", "uuid3": "word2"},
				votingResult: {}
			}
			serverFunctions.toggle(gameStatus);
			expect(gameStatus.voting).toBeTruthy();
			expect(gameStatus.story).toEqual("A story");
			expect(gameStatus.bannedStrings).toEqual(["BANNED_WORD"]);
			expect(gameStatus.votingQueue).toEqual({});
			expect(gameStatus.votingResult).toEqual({"word2": 0, "word1": 0});
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
