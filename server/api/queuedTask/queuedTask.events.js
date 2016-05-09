/**
 * QueuedTask model events
 */

'use strict';

import { EventEmitter } from 'events';
var QueuedTask = require('../../sqldb').QueuedTask;
var QueuedTaskEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
QueuedTaskEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  QueuedTask.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    QueuedTaskEvents.emit(event + ':' + doc._id, doc);
    QueuedTaskEvents.emit(event, doc);
    done(null);
  };
}

export default QueuedTaskEvents;
