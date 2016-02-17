/**
 * JobsEmployer model events
 */

'use strict';

import {EventEmitter} from 'events';
var JobsEmployer = require('../../sqldb').JobsEmployer;
var JobsEmployerEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
JobsEmployerEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  JobsEmployer.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    JobsEmployerEvents.emit(event + ':' + doc._id, doc);
    JobsEmployerEvents.emit(event, doc);
    done(null);
  }
}

export default JobsEmployerEvents;
