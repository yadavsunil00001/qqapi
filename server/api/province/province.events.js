/**
 * Province model events
 */



import { EventEmitter } from 'events';
var Province = require('../../sqldb').Province;
var ProvinceEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProvinceEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Province.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    ProvinceEvents.emit(event + ':' + doc._id, doc);
    ProvinceEvents.emit(event, doc);
    done(null);
  };
}

export default ProvinceEvents;
