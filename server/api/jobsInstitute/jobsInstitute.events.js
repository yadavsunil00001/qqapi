/**
 * JobsInstitute model events
 */



import { EventEmitter } from 'events';
var JobsInstitute = require('../../sqldb').JobsInstitute;
var JobsInstituteEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
JobsInstituteEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  JobsInstitute.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    JobsInstituteEvents.emit(event + ':' + doc._id, doc);
    JobsInstituteEvents.emit(event, doc);
    done(null);
  };
}

export default JobsInstituteEvents;
