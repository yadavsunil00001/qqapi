/**
 * Designation model events
 */

'use strict';

import {EventEmitter} from 'events';
var Designation = require('../../sqldb').Designation;
var DesignationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DesignationEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Designation.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    DesignationEvents.emit(event + ':' + doc._id, doc);
    DesignationEvents.emit(event, doc);
    done(null);
  }
}

export default DesignationEvents;
