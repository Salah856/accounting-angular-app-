const RightController = require('./right.controller');
const eventBus = require('./right-event-bus');

eventBus.on('getRights', options => RightController.getRights(options));
