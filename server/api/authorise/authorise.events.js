/**
 * Authorise model events
 */

'use strict';

import { EventEmitter } from 'events';
var Authorise = require('../../sqldb').Authorise;
var AuthoriseEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AuthoriseEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Authorise.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    AuthoriseEvents.emit(event + ':' + doc._id, doc);
    AuthoriseEvents.emit(event, doc);
    done(null);
  };
}

export default AuthoriseEvents;
