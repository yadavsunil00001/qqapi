/**
 * Group model events
 */

'use strict';

import {EventEmitter} from 'events';
var Group = require('../../sqldb').Group;
var GroupEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
GroupEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Group.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    GroupEvents.emit(event + ':' + doc._id, doc);
    GroupEvents.emit(event, doc);
    done(null);
  }
}

export default GroupEvents;
