/**
 * Created by Manjesh on 03-03-2016.
 */
'use strict';

import _ from 'lodash';

export function handleUniqueValidationError (model,where){
  var that = this;
  return function (err) {
    var errorMessages = _.map(err.errors,'message')
    if( -1 !== errorMessages.indexOf(Object.keys(where)[0] + " must be unique")){
      return model
        .find({where: where})
        .then(entity => {
          err.message = Object.keys(where)[0] + " must be unique"
          err.data = entity
          return Promise.reject(err)
        })
    } else {
      return Promise.reject(err);
    }
  }
}
