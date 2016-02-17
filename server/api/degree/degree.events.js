/**
 * Degree model events
 */

'use strict';

import {EventEmitter} from 'events';
var Degree = require('../../sqldb').Degree;
var DegreeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DegreeEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Degree.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    DegreeEvents.emit(event + ':' + doc._id, doc);
    DegreeEvents.emit(event, doc);
    done(null);
  }
}

export default DegreeEvents;
