/**
 * JobStatusLog model events
 */

'use strict';

import {EventEmitter} from 'events';
var JobStatusLog = require('../../sqldb').JobStatusLog;
var JobStatusLogEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
JobStatusLogEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  JobStatusLog.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    JobStatusLogEvents.emit(event + ':' + doc._id, doc);
    JobStatusLogEvents.emit(event, doc);
    done(null);
  }
}

export default JobStatusLogEvents;
