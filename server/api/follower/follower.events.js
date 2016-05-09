/**
 * Follower model events
 */



import { EventEmitter } from 'events';
var Follower = require('../../sqldb').Follower;
var FollowerEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FollowerEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Follower.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    FollowerEvents.emit(event + ':' + doc._id, doc);
    FollowerEvents.emit(event, doc);
    done(null);
  };
}

export default FollowerEvents;
