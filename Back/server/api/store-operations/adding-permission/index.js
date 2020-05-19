const routes = require('./adding-permission.routes');
const controller = require('./adding-permission.controller');
const addingPermissionEventBus = require('./adding-permission-event-bus');
require('./adding-permission.events');

module.exports = {
  routes,
  controller,
  addingPermissionEventBus,
};
