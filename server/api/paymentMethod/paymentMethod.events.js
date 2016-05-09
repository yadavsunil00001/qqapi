/**
 * PaymentMethod model events
 */



import { EventEmitter } from 'events';
var PaymentMethod = require('../../sqldb').PaymentMethod;
var PaymentMethodEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PaymentMethodEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  PaymentMethod.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    PaymentMethodEvents.emit(event + ':' + doc._id, doc);
    PaymentMethodEvents.emit(event, doc);
    done(null);
  };
}

export default PaymentMethodEvents;
