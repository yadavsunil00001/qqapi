/**
 * Welcome model events
 */

'use strict';

import { EventEmitter } from 'events';
var Welcome = require('../../sqldb').Welcome;
var WelcomeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
WelcomeEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Welcome.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    WelcomeEvents.emit(event + ':' + doc._id, doc);
    WelcomeEvents.emit(event, doc);
    done(null);
  };
}

export default WelcomeEvents;
