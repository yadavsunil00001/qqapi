/**
 * ActionableState model events
 */

'use strict';

import { EventEmitter } from 'events';
var ActionableState = require('../../sqldb').ActionableState;
var ActionableStateEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ActionableStateEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ActionableState.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    ActionableStateEvents.emit(event + ':' + doc._id, doc);
    ActionableStateEvents.emit(event, doc);
    done(null);
  };
}

export default ActionableStateEvents;
