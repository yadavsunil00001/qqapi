/**
 * Region model events
 */

'use strict';

import {EventEmitter} from 'events';
var Region = require('../../sqldb').Region;
var RegionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
RegionEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Region.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    RegionEvents.emit(event + ':' + doc._id, doc);
    RegionEvents.emit(event, doc);
    done(null);
  }
}

export default RegionEvents;
