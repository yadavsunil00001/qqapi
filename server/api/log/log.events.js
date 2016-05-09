/**
 * Log model events
 */

'use strict';

import { EventEmitter } from 'events';
var Log = require('../../sqldb').Log;
var LogEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
LogEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Log.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    LogEvents.emit(event + ':' + doc._id, doc);
    LogEvents.emit(event, doc);
    done(null);
  };
}

export default LogEvents;
