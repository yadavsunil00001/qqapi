/**
 * ApplicantSkill model events
 */



import { EventEmitter } from 'events';
var ApplicantSkill = require('../../sqldb').ApplicantSkill;
var ApplicantSkillEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ApplicantSkillEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ApplicantSkill.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    ApplicantSkillEvents.emit(event + ':' + doc._id, doc);
    ApplicantSkillEvents.emit(event, doc);
    done(null);
  };
}

export default ApplicantSkillEvents;
