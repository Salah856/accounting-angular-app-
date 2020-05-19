const ItemTypeController = require('./item-type.controller');
const eventBus = require('./item-type-event-bus');

eventBus.on('getItemTypes', options => ItemTypeController.getItemTypes(options));
