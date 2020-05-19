const ItemController = require('./item.controller');
const eventBus = require('./item-event-bus');

eventBus.on('getItems', options => ItemController.getItems(options));
