/**
 * Oauth model events
 */

'use strict';

import {EventEmitter} from 'events';
var Oauth = require('../../sqldb').Oauth;
var OauthEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
OauthEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Oauth.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    OauthEvents.emit(event + ':' + doc._id, doc);
    OauthEvents.emit(event, doc);
    done(null);
  }
}

export default OauthEvents;
