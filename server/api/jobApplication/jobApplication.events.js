/**
 * JobApplication model events
 */

'use strict';

import {EventEmitter} from 'events';
var JobApplication = require('../../sqldb').JobApplication;
var JobApplicationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
JobApplicationEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  JobApplication.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    JobApplicationEvents.emit(event + ':' + doc._id, doc);
    JobApplicationEvents.emit(event, doc);
    done(null);
  }
}

export default JobApplicationEvents;
