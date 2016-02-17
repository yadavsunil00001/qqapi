/**
 * JobScore model events
 */

'use strict';

import {EventEmitter} from 'events';
var JobScore = require('../../sqldb').JobScore;
var JobScoreEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
JobScoreEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  JobScore.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    JobScoreEvents.emit(event + ':' + doc._id, doc);
    JobScoreEvents.emit(event, doc);
    done(null);
  }
}

export default JobScoreEvents;
