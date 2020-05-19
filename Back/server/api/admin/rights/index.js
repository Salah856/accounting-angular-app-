const routes = require('./right.routes');
const controller = require('./right.controller');
const rightEventBus = require('./right-event-bus');
require('./right.events');

module.exports = {
  routes,
  controller,
  rightEventBus,
};
