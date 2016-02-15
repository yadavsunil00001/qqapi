/**
 * JobAllocation model events
 */

'use strict';

import {EventEmitter} from 'events';
var JobAllocation = require('../../sqldb').JobAllocation;
var JobAllocationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
JobAllocationEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  JobAllocation.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    JobAllocationEvents.emit(event + ':' + doc._id, doc);
    JobAllocationEvents.emit(event, doc);
    done(null);
  }
}

export default JobAllocationEvents;
