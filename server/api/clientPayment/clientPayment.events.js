/**
 * ClientPayment model events
 */

'use strict';

import {EventEmitter} from 'events';
var ClientPayment = require('../../sqldb').ClientPayment;
var ClientPaymentEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ClientPaymentEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ClientPayment.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ClientPaymentEvents.emit(event + ':' + doc._id, doc);
    ClientPaymentEvents.emit(event, doc);
    done(null);
  }
}

export default ClientPaymentEvents;
