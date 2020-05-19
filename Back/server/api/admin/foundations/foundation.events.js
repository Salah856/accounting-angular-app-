const eventBus = require('./foundation-event-bus');
const FoundationController = require('./foundation.controller');

eventBus.on('getFoundations', options => FoundationController.getFoundations(options));
