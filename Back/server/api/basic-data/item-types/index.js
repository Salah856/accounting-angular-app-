const routes = require('./item-type.routes');
const controller = require('./item-type.controller');
const itemTypeEventBus = require('./item-type-event-bus');
require('./item-type.events');

module.exports = {
  routes,
  controller,
  itemTypeEventBus,
};
