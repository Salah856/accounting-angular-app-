const { EventEmitter } = require('events');
const selfAddressed = require('self-addressed');


class EventBusFactory {
  static create() {
    const eventEmitter = new EventEmitter();
    const defaultEmit = EventEmitter.prototype.emit;
    // eslint-disable-next-line func-names
    eventEmitter.emit = function (name, data) {
      function mailman(address, envelope) {
        defaultEmit.call(address, name, envelope);
      }
      return selfAddressed(mailman, this, data);
    };

    const defaultOn = EventEmitter.prototype.on;
    // eslint-disable-next-line func-names
    eventEmitter.on = function (name, fn) {
      function onSelfAddressedEnvelope(envelope) {
        if (selfAddressed.is(envelope)) {
          const result = fn(envelope.payload);
          selfAddressed(envelope, result);
          // there is nowhere to send the response envelope
          // event emitters are unidirectional.
          // so open the envelope right away!
          selfAddressed({ ...envelope, replies: 1 }); // deliver
        }
      }
      defaultOn.call(this, name, onSelfAddressedEnvelope);
    };
    return eventEmitter;
  }
}

module.exports = EventBusFactory;
