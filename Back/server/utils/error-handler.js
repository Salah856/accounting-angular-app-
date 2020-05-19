const logger = require('./logger');

const errorHandler = (err) => {
  logger.log('error', err.message, { meta: err });
  // Do more stuff here maybe send an email or or publish to redmine ...
};

module.exports = errorHandler;
