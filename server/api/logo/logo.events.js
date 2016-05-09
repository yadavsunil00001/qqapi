/**
 * Logo model events
 */



import { EventEmitter } from 'events';
var Logo = require('../../sqldb').Logo;
var LogoEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
LogoEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Logo.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    LogoEvents.emit(event + ':' + doc._id, doc);
    LogoEvents.emit(event, doc);
    done(null);
  };
}

export default LogoEvents;
