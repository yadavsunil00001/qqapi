/**
 * UserTawktoToken model events
 */



import { EventEmitter } from 'events';
var UserTawktoToken = require('../../sqldb').UserTawktoToken;
var UserTawktoTokenEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserTawktoTokenEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  UserTawktoToken.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    UserTawktoTokenEvents.emit(event + ':' + doc._id, doc);
    UserTawktoTokenEvents.emit(event, doc);
    done(null);
  };
}

export default UserTawktoTokenEvents;
