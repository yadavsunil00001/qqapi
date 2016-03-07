/**
 * ConsultantResponse model events
 */

'use strict';

import {EventEmitter} from 'events';
var ConsultantResponse = require('../../sqldb').ConsultantResponse;
var ConsultantResponseEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ConsultantResponseEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ConsultantResponse.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ConsultantResponseEvents.emit(event + ':' + doc._id, doc);
    ConsultantResponseEvents.emit(event, doc);
    done(null);
  }
}

export default ConsultantResponseEvents;
