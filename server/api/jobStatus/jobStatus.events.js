/**
 * JobStatus model events
 */

'use strict';

import {EventEmitter} from 'events';
var JobStatus = require('../../sqldb').JobStatus;
var JobStatusEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
JobStatusEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  JobStatus.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    JobStatusEvents.emit(event + ':' + doc._id, doc);
    JobStatusEvents.emit(event, doc);
    done(null);
  }
}

export default JobStatusEvents;
