/**
 * Endpoint model events
 */

'use strict';

import {EventEmitter} from 'events';
var Endpoint = require('../../sqldb').Endpoint;
var EndpointEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
EndpointEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Endpoint.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    EndpointEvents.emit(event + ':' + doc._id, doc);
    EndpointEvents.emit(event, doc);
    done(null);
  }
}

export default EndpointEvents;
