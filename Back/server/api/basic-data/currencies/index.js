const routes = require('./currency.routes');
const controller = require('./currency.controller');
const currencyEventBus = require('./currency-event-bus');
require('./currency.events');

module.exports = {
  routes,
  controller,
  currencyEventBus,
};
