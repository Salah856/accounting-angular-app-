const routes = require('./user.routes');
const controller = require('./user.controller');
const userEventBus = require('./user-event-bus');
require('./user.events');

module.exports = {
  routes,
  controller,
  userEventBus,
};
