/**
 * Institute model events
 */



import { EventEmitter } from 'events';
var Institute = require('../../sqldb').Institute;
var InstituteEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
InstituteEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Institute.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    InstituteEvents.emit(event + ':' + doc._id, doc);
    InstituteEvents.emit(event, doc);
    done(null);
  };
}

export default InstituteEvents;
