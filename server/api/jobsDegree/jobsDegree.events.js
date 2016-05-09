/**
 * JobsDegree model events
 */

'use strict';

import { EventEmitter } from 'events';
var JobsDegree = require('../../sqldb').JobsDegree;
var JobsDegreeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
JobsDegreeEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  JobsDegree.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    JobsDegreeEvents.emit(event + ':' + doc._id, doc);
    JobsDegreeEvents.emit(event, doc);
    done(null);
  };
}

export default JobsDegreeEvents;
