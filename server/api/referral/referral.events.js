/**
 * Referral model events
 */

'use strict';

import { EventEmitter } from 'events';
var Referral = require('../../sqldb').Referral;
var ReferralEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ReferralEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Referral.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    ReferralEvents.emit(event + ':' + doc._id, doc);
    ReferralEvents.emit(event, doc);
    done(null);
  };
}

export default ReferralEvents;
