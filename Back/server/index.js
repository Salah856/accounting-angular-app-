const express = require('express');
const boom = require('boom');
const path = require('path');
const api = require('./api');
const middlewares = require('./middlewares');
const errorHandler = require('./utils/error-handler');
const generalMessages = require('./utils/general-messages');

const app = express();
// setup the app middlware
middlewares(app);
app.use(express.static('public'));
// setup the api
app.use('/api/', api.router);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
// set up global error handling
app.use((err, req, res, next) => {
  errorHandler(err);
  if (err.isOperational) {
    return res.status(err.statusCode).send(boom.boomify(err));
  }
  if (process.env.production) {
    return res.status(500).send({ statusCode: 500, message: generalMessages.error });
  }
  return next(err);
});

// export the app for testing
module.exports = app;
