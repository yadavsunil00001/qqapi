/**
 * Skill model events
 */



import { EventEmitter } from 'events';
var Skill = require('../../sqldb').Skill;
var SkillEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
SkillEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Skill.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    SkillEvents.emit(event + ':' + doc._id, doc);
    SkillEvents.emit(event, doc);
    done(null);
  };
}

export default SkillEvents;
