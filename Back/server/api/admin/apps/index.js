const routes = require('./app.routes');
const controller = require('./app.controller');
const appEventBus = require('./app-event-bus');
require('./app.events');

module.exports = {
  routes,
  controller,
  appEventBus,
};
