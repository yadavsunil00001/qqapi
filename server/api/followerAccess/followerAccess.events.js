/**
 * FollowerAccess model events
 */

'use strict';

import {EventEmitter} from 'events';
var FollowerAccess = require('../../sqldb').FollowerAccess;
var FollowerAccessEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FollowerAccessEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  FollowerAccess.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    FollowerAccessEvents.emit(event + ':' + doc._id, doc);
    FollowerAccessEvents.emit(event, doc);
    done(null);
  }
}

export default FollowerAccessEvents;
