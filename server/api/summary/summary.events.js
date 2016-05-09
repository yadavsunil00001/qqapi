/**
 * Summary model events
 */

'use strict';

import { EventEmitter } from 'events';
var Summary = require('../../sqldb').Summary;
var SummaryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
SummaryEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Summary.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    SummaryEvents.emit(event + ':' + doc._id, doc);
    SummaryEvents.emit(event, doc);
    done(null);
  };
}

export default SummaryEvents;
