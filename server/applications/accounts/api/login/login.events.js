/**
 * Login model events
 */

'use strict';

import {EventEmitter} from 'events';
var Login = require('../../sqldb').Login;
var LoginEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
LoginEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Login.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    LoginEvents.emit(event + ':' + doc._id, doc);
    LoginEvents.emit(event, doc);
    done(null);
  }
}

export default LoginEvents;
