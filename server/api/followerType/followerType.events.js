/**
 * FollowerType model events
 */

'use strict';

import {EventEmitter} from 'events';
var FollowerType = require('../../sqldb').FollowerType;
var FollowerTypeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FollowerTypeEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  FollowerType.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    FollowerTypeEvents.emit(event + ':' + doc._id, doc);
    FollowerTypeEvents.emit(event, doc);
    done(null);
  }
}

export default FollowerTypeEvents;
