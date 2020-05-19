const routes = require('./exchange-permission.routes');
const controller = require('./exchange-permission.controller');
const exchangePermissionEventBus = require('./exchange-permission-event-bus');
require('./exchange-permission.events');

module.exports = {
  routes,
  controller,
  exchangePermissionEventBus,
};
