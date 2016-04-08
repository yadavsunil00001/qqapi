/**
 * ScreeningState model events
 */

'use strict';

import {EventEmitter} from 'events';
var ScreeningState = require('../../sqldb').ScreeningState;
var ScreeningStateEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ScreeningStateEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ScreeningState.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ScreeningStateEvents.emit(event + ':' + doc._id, doc);
    ScreeningStateEvents.emit(event, doc);
    done(null);
  }
}

export default ScreeningStateEvents;
