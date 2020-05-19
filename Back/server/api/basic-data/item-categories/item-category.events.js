const ItemCategoryController = require('./item-category.controller');
const eventBus = require('./item-category-event-bus');

eventBus.on('getItemCategories', options => ItemCategoryController.getItemCategories(options));
