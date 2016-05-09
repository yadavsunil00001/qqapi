/**
 * Email model events
 */

'use strict';

import { EventEmitter } from 'events';
var Email = require('../../sqldb').Email;
var EmailEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
EmailEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Email.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    EmailEvents.emit(event + ':' + doc._id, doc);
    EmailEvents.emit(event, doc);
    done(null);
  };
}

export default EmailEvents;
