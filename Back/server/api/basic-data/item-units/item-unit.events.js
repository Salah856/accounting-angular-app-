const ItemUnitController = require('./item-unit.controller');
const eventBus = require('./item-unit-event-bus');

eventBus.on('getItemUnits', options => ItemUnitController.getItemUnits(options));
