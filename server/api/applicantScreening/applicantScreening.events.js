/**
 * ApplicantScreening model events
 */

'use strict';

import {EventEmitter} from 'events';
var ApplicantScreening = require('../../sqldb').ApplicantScreening;
var ApplicantScreeningEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ApplicantScreeningEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ApplicantScreening.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ApplicantScreeningEvents.emit(event + ':' + doc._id, doc);
    ApplicantScreeningEvents.emit(event, doc);
    done(null);
  }
}

export default ApplicantScreeningEvents;
