const eventBus = require('./user-event-bus');
const UserController = require('./user.controller');

eventBus.on('getUserRights', data => UserController.getRights(data.id, data.options));
