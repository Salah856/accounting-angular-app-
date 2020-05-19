const routes = require('./company.routes');
const controller = require('./company.controller');
const companyEventBus = require('./company-event-bus');
require('./company.events');

module.exports = {
  routes,
  controller,
  companyEventBus,
};
