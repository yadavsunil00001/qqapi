/**
 * ApplicantPreferenceTime model events
 */

'use strict';

import {EventEmitter} from 'events';
var ApplicantPreferenceTime = require('../../sqldb').ApplicantPreferenceTime;
var ApplicantPreferenceTimeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ApplicantPreferenceTimeEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ApplicantPreferenceTime.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ApplicantPreferenceTimeEvents.emit(event + ':' + doc._id, doc);
    ApplicantPreferenceTimeEvents.emit(event, doc);
    done(null);
  }
}

export default ApplicantPreferenceTimeEvents;
