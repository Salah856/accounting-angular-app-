const routes = require('./foundation.routes');
const controller = require('./foundation.controller');
const foundationEventBus = require('./foundation-event-bus');
require('./foundation.events');

module.exports = {
  routes,
  controller,
  foundationEventBus,
};
