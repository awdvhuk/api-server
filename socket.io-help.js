const app = require('../app');
const debug = require('debug')('3BACK:server');
const http = require('http');
const db = require('../src/models');
const { botInit } = require('../src/utils/bot/app');
/**
 * Get port from environment and store in Express.
 */

const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

const io = require('socket.io')(server);

botInit(io);

/**
 * Listen on provided port, on all network interfaces.
 */

const runServer = () => new Promise((resolve, reject) => {
  server.listen(port, (err) => {
    if (err) { return reject(err); }
    return resolve();
  });
});

Promise.all([
  db.sequelize.sync(),
  runServer()
])
  .then(() => {
    debug(`The server is running at localhost:${port}`);
  });