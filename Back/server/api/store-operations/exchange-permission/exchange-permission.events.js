const ExchangePermissionController = require('./exchange-permission.controller');
const eventBus = require('./exchange-permission-event-bus');

eventBus.on('createExchangePermission', data => ExchangePermissionController.createPermission(data));
