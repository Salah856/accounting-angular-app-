const routes = require('./item-category.routes');
const controller = require('./item-category.controller');
const itemCategoryEventBus = require('./item-category-event-bus');
require('./item-category.events');

module.exports = {
  routes,
  controller,
  itemCategoryEventBus,
};
