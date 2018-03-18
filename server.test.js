const serverFunctions = require('./server_methods.js')

test('needs Space before "a"', () => {
	expect(serverFunctions.needSpace("He likes", "a")).toBe(true);
})

test('needs Space before ","', () =>{
	expect(serverFunctions.needSpace("He likes", ",")).toBe(false);
})