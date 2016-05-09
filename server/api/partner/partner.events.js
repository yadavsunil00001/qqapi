/**
 * Partner model events
 */

'use strict';

import { EventEmitter } from 'events';
var Partner = require('../../sqldb').Partner;
var PartnerEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PartnerEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Partner.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    PartnerEvents.emit(event + ':' + doc._id, doc);
    PartnerEvents.emit(event, doc);
    done(null);
  };
}

export default PartnerEvents;
