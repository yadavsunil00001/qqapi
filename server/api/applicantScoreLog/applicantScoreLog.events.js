/**
 * ApplicantScoreLog model events
 */

'use strict';

import { EventEmitter } from 'events';
var ApplicantScoreLog = require('../../sqldb').ApplicantScoreLog;
var ApplicantScoreLogEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ApplicantScoreLogEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ApplicantScoreLog.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    ApplicantScoreLogEvents.emit(event + ':' + doc._id, doc);
    ApplicantScoreLogEvents.emit(event, doc);
    done(null);
  };
}

export default ApplicantScoreLogEvents;
