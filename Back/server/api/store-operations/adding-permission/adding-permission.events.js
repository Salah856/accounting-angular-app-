const AddingPermissionController = require('./adding-permission.controller');
const eventBus = require('./adding-permission-event-bus');

eventBus.on('createAddingPermission', data => AddingPermissionController.createPermission(data));
