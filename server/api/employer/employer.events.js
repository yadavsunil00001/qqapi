/**
 * Employer model events
 */

'use strict';

import { EventEmitter } from 'events';
var Employer = require('../../sqldb').Employer;
var EmployerEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
EmployerEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Employer.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    EmployerEvents.emit(event + ':' + doc._id, doc);
    EmployerEvents.emit(event, doc);
    done(null);
  };
}

export default EmployerEvents;
