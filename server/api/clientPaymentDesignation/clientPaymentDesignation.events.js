/**
 * ClientPaymentDesignation model events
 */

'use strict';

import { EventEmitter } from 'events';
var ClientPaymentDesignation = require('../../sqldb').ClientPaymentDesignation;
var ClientPaymentDesignationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ClientPaymentDesignationEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ClientPaymentDesignation.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    ClientPaymentDesignationEvents.emit(event + ':' + doc._id, doc);
    ClientPaymentDesignationEvents.emit(event, doc);
    done(null);
  };
}

export default ClientPaymentDesignationEvents;
