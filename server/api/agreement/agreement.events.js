/**
 * Agreement model events
 */

'use strict';

import {EventEmitter} from 'events';
var Agreement = require('../../sqldb').Agreement;
var AgreementEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AgreementEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Agreement.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    AgreementEvents.emit(event + ':' + doc._id, doc);
    AgreementEvents.emit(event, doc);
    done(null);
  }
}

export default AgreementEvents;
