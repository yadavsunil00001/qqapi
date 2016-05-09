/**
 * JobDownload model events
 */



import { EventEmitter } from 'events';
var JobDownload = require('../../sqldb').JobDownload;
var JobDownloadEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
JobDownloadEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  JobDownload.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    JobDownloadEvents.emit(event + ':' + doc._id, doc);
    JobDownloadEvents.emit(event, doc);
    done(null);
  };
}

export default JobDownloadEvents;
