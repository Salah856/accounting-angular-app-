const dotenv = require('dotenv');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const mongoose = require('mongoose');
const Path = require('path');
const app = require('./server');
const logger = require('./server/utils/logger');
const errorHandler = require('./server/utils/error-handler');

dotenv.config();

global.baseDirectory = __dirname;
global.publicDirectory = Path.join(__dirname, 'public');
app.listen(process.env.serverPort);
logger.log('info', `Server running at ${process.env.serverPort}`);
const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};
mongoose.connect(`mongodb://${process.env.dbHost}:${process.env.dbPort}/${process.env.dbName}`, mongooseOptions, (err) => {
  if (err) {
    logger.log('error', 'Monoose failed to connect', { meta: err.stack });
  } else {
    logger.log('info', 'Mongoose connected');
  }
});

process.on('unhandledRejection', (reason) => {
  // I just caught an unhandled promise rejection,
  // since we already have fallback handler for unhandled errors (see below),
  // let throw and let him handle that
  throw reason;
});

process.on('uncaughtException', (error) => {
  // I just received an error that was never handled,
  // time to handle it and then decide whether a restart is needed
  // Do some clean up
  if (error.isOperational) {
    errorHandler(error);
  } else {
    process.exit(1);
  }
});
