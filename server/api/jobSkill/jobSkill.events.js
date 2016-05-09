/**
 * JobSkill model events
 */



import { EventEmitter } from 'events';
var JobSkill = require('../../sqldb').JobSkill;
var JobSkillEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
JobSkillEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  JobSkill.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    JobSkillEvents.emit(event + ':' + doc._id, doc);
    JobSkillEvents.emit(event, doc);
    done(null);
  };
}

export default JobSkillEvents;
