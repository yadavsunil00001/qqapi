/**
 * Resume model events
 */



import { EventEmitter } from 'events';
var Resume = require('../../sqldb').Resume;
var ResumeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ResumeEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Resume.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    ResumeEvents.emit(event + ':' + doc._id, doc);
    ResumeEvents.emit(event, doc);
    done(null);
  };
}

export default ResumeEvents;
