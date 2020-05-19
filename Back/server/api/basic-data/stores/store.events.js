const StoreController = require('./store.controller');
const eventBus = require('./store-event-bus');

eventBus.on('getStores', options => StoreController.getStores(options));
