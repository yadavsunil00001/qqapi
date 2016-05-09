/**
 * Hotline model events
 */

'use strict';

import { EventEmitter } from 'events';
var Hotline = require('../../sqldb').Hotline;
var HotlineEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
HotlineEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Hotline.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    HotlineEvents.emit(event + ':' + doc._id, doc);
    HotlineEvents.emit(event, doc);
    done(null);
  };
}

export default HotlineEvents;
