# communityAuthorApi
node.js server for "community author" inspired by #youtubeschriebteinegeschichte

This server provides a REST-api and should serve as the logic unit behind the game, too.
A web app is planned to utilize this server. Maybe, it will be coded in Angular.

## Testing
At the moment, testing is manually done using software like Postman.
An Automatic Testing/CI Environment ist planned.

## Executing
Servers will have to be hosted on one's own. To do so, one needs to clone the
repository as well as to install node.js. With the command line "inside" the
repository's directory, you need to run `npm run start`.

### Used node.js packages
- express
- fs / sqlite3 / ... (still to decide)
