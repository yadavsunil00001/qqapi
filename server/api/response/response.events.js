/**
 * Response model events
 */

'use strict';

import {EventEmitter} from 'events';
var Response = require('../../sqldb').Response;
var ResponseEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ResponseEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Response.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ResponseEvents.emit(event + ':' + doc._id, doc);
    ResponseEvents.emit(event, doc);
    done(null);
  }
}

export default ResponseEvents;
