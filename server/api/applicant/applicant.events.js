/**
 * Applicant model events
 */



import { EventEmitter } from 'events';
var Applicant = require('../../sqldb').Applicant;
var ApplicantEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ApplicantEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Applicant.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    ApplicantEvents.emit(event + ':' + doc._id, doc);
    ApplicantEvents.emit(event, doc);
    done(null);
  };
}

export default ApplicantEvents;
