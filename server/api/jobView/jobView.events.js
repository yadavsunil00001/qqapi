/**
 * JobView model events
 */

'use strict';

import {EventEmitter} from 'events';
var JobView = require('../../sqldb').JobView;
var JobViewEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
JobViewEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  JobView.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    JobViewEvents.emit(event + ':' + doc._id, doc);
    JobViewEvents.emit(event, doc);
    done(null);
  }
}

export default JobViewEvents;
