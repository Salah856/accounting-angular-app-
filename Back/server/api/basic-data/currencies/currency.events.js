const CurrencyController = require('./currency.controller');
const eventBus = require('./currency-event-bus');

eventBus.on('getCurrencies', options => CurrencyController.getCurrencies(options));
