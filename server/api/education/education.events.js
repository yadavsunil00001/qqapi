/**
 * Education model events
 */



import { EventEmitter } from 'events';
var Education = require('../../sqldb').Education;
var EducationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
EducationEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Education.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    EducationEvents.emit(event + ':' + doc._id, doc);
    EducationEvents.emit(event, doc);
    done(null);
  };
}

export default EducationEvents;
