/**
 * ClientPreferredFunction model events
 */



import { EventEmitter } from 'events';
var ClientPreferredFunction = require('../../sqldb').ClientPreferredFunction;
var ClientPreferredFunctionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ClientPreferredFunctionEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ClientPreferredFunction.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    ClientPreferredFunctionEvents.emit(event + ':' + doc._id, doc);
    ClientPreferredFunctionEvents.emit(event, doc);
    done(null);
  };
}

export default ClientPreferredFunctionEvents;
