const bodyParser = require('body-parser');
const helmet = require('helmet');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const authMiddleware = require('../middlewares/auth.middleware');


// setup global middleware here

module.exports = (app) => {
  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(multer({ dest: 'temp' }).any());
  app.use(helmet());
  app.use(cors({ exposedHeaders: ['Content-Type', 'Authorization'] }));
  app.use(authMiddleware());
};
