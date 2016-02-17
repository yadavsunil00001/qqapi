/**
 * JobContent model events
 */

'use strict';

import {EventEmitter} from 'events';
var JobContent = require('../../sqldb').JobContent;
var JobContentEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
JobContentEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  JobContent.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    JobContentEvents.emit(event + ':' + doc._id, doc);
    JobContentEvents.emit(event, doc);
    done(null);
  }
}

export default JobContentEvents;
