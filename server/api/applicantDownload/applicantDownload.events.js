/**
 * ApplicantDownload model events
 */

'use strict';

import { EventEmitter } from 'events';
var ApplicantDownload = require('../../sqldb').ApplicantDownload;
var ApplicantDownloadEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ApplicantDownloadEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ApplicantDownload.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    ApplicantDownloadEvents.emit(event + ':' + doc._id, doc);
    ApplicantDownloadEvents.emit(event, doc);
    done(null);
  };
}

export default ApplicantDownloadEvents;
