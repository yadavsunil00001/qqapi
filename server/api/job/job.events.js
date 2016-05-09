/**
 * Job model events
 */

'use strict';

import { EventEmitter } from 'events';
var Job = require('../../sqldb').Job;
var JobEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
JobEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Job.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    JobEvents.emit(event + ':' + doc._id, doc);
    JobEvents.emit(event, doc);
    done(null);
  };
}

export default JobEvents;
