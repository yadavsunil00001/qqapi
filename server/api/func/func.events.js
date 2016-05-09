/**
 * Func model events
 */

'use strict';

import { EventEmitter } from 'events';
var Func = require('../../sqldb').Func;
var FuncEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FuncEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Func.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    FuncEvents.emit(event + ':' + doc._id, doc);
    FuncEvents.emit(event, doc);
    done(null);
  };
}

export default FuncEvents;
