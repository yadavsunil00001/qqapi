/**
 * Reference model events
 */

'use strict';

import {EventEmitter} from 'events';
var Reference = require('../../sqldb').Reference;
var ReferenceEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ReferenceEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Reference.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ReferenceEvents.emit(event + ':' + doc._id, doc);
    ReferenceEvents.emit(event, doc);
    done(null);
  }
}

export default ReferenceEvents;
