const routes = require('./item.routes');
const controller = require('./item.controller');
const itemEventBus = require('./item-event-bus');
require('./item.events');

module.exports = {
  routes,
  controller,
  itemEventBus,
};
