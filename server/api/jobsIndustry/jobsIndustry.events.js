/**
 * JobsIndustry model events
 */

'use strict';

import { EventEmitter } from 'events';
var JobsIndustry = require('../../sqldb').JobsIndustry;
var JobsIndustryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
JobsIndustryEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  JobsIndustry.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    JobsIndustryEvents.emit(event + ':' + doc._id, doc);
    JobsIndustryEvents.emit(event, doc);
    done(null);
  };
}

export default JobsIndustryEvents;
