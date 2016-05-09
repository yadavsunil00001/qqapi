/**
 * JobComment model events
 */

'use strict';

import { EventEmitter } from 'events';
var JobComment = require('../../sqldb').JobComment;
var JobCommentEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
JobCommentEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  JobComment.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    JobCommentEvents.emit(event + ':' + doc._id, doc);
    JobCommentEvents.emit(event, doc);
    done(null);
  };
}

export default JobCommentEvents;
