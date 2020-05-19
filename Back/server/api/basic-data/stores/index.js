const routes = require('./store.routes');
const controller = require('./store.controller');
const storeEventBus = require('./store-event-bus');
require('./store.events');

module.exports = {
  routes,
  controller,
  storeEventBus,
};
