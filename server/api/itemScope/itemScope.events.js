/**
 * ItemScope model events
 */

'use strict';

import { EventEmitter } from 'events';
var ItemScope = require('../../sqldb').ItemScope;
var ItemScopeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ItemScopeEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove',
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ItemScope.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc, options, done) {
    ItemScopeEvents.emit(event + ':' + doc._id, doc);
    ItemScopeEvents.emit(event, doc);
    done(null);
  };
}

export default ItemScopeEvents;
