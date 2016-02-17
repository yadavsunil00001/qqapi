/**
 * UsageLog model events
 */

'use strict';

import {EventEmitter} from 'events';
var UsageLog = require('../../sqldb').UsageLog;
var UsageLogEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UsageLogEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  UsageLog.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    UsageLogEvents.emit(event + ':' + doc._id, doc);
    UsageLogEvents.emit(event, doc);
    done(null);
  }
}

export default UsageLogEvents;
