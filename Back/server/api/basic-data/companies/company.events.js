const CompanyController = require('./company.controller');
const eventBus = require('./company-event-bus');

eventBus.on('getCompanies', options => CompanyController.getCompanies(options));
