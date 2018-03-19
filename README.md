# communityAuthorApi
node.js server for "community author" inspired by #youtubeschriebteinegeschichte

This server provides an HTTP-Api and should serve as the logic unit behind the game, too.
A web app is created in parallel as a client for this server.
See [this repository](https://github.com/SchokoTets/communityAuthorWeb "communityAuthorWeb").

## Testing
At the moment, testing is manually done using software like Postman.
An Automatic Testing/CI Environment is also up and running, we're using CircleCI.

## Executing
Servers will have to be hosted on one's own. To do so, one needs to clone the
repository as well as to install node.js. With the command line "inside" the
repository's directory, to setup, run `npm install`. To start the application, execute `npm run start`.

### Used npm packages
- express v4.16.3
- jest v22.4.2 (for developing)
