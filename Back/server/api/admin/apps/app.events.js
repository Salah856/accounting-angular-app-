const eventBus = require('./app-event-bus');
const AppController = require('./app.controller');

eventBus.on('getApps', options => AppController.getApps(options));
