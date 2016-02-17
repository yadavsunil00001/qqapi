/**
 * Experience model events
 */

'use strict';

import {EventEmitter} from 'events';
var Experience = require('../../sqldb').Experience;
var ExperienceEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ExperienceEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Experience.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ExperienceEvents.emit(event + ':' + doc._id, doc);
    ExperienceEvents.emit(event, doc);
    done(null);
  }
}

export default ExperienceEvents;
