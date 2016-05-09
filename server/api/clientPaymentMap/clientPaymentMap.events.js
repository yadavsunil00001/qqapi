/**
 * ClientPaymentMap model events
 */



import { EventEmitter } from 'events';
var ClientPaymentMap = require('../../sqldb').ClientPaymentMap;
var ClientPaymentMapEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ClientPaymentMapEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ClientPaymentMap.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    ClientPaymentMapEvents.emit(event + ':' + doc._id, doc);
    ClientPaymentMapEvents.emit(event, doc);
    done(null);
  };
}

export default ClientPaymentMapEvents;
