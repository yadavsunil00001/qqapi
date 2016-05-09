/**
 * ClientPreferredIndustry model events
 */

'use strict';

import { EventEmitter } from 'events';
var ClientPreferredIndustry = require('../../sqldb').ClientPreferredIndustry;
var ClientPreferredIndustryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ClientPreferredIndustryEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ClientPreferredIndustry.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    ClientPreferredIndustryEvents.emit(event + ':' + doc._id, doc);
    ClientPreferredIndustryEvents.emit(event, doc);
    done(null);
  };
}

export default ClientPreferredIndustryEvents;
