/**
 * ApplicantView model events
 */



import { EventEmitter } from 'events';
var ApplicantView = require('../../sqldb').ApplicantView;
var ApplicantViewEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ApplicantViewEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ApplicantView.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    ApplicantViewEvents.emit(event + ':' + doc._id, doc);
    ApplicantViewEvents.emit(event, doc);
    done(null);
  };
}

export default ApplicantViewEvents;
