/**
 * PhoneNumber model events
 */



import { EventEmitter } from 'events';
var PhoneNumber = require('../../sqldb').PhoneNumber;
var PhoneNumberEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PhoneNumberEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  PhoneNumber.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    PhoneNumberEvents.emit(event + ':' + doc._id, doc);
    PhoneNumberEvents.emit(event, doc);
    done(null);
  };
}

export default PhoneNumberEvents;
