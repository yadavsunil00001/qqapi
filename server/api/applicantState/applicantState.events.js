/**
 * ApplicantState model events
 */

'use strict';

import {EventEmitter} from 'events';
var ApplicantState = require('../../sqldb').ApplicantState;
var ApplicantStateEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ApplicantStateEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ApplicantState.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ApplicantStateEvents.emit(event + ':' + doc._id, doc);
    ApplicantStateEvents.emit(event, doc);
    done(null);
  }
}

export default ApplicantStateEvents;
