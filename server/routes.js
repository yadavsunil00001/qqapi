/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/summary', require('./api/summary'));
  app.use('/api/jobComments', require('./api/jobComment'));
  app.use('/api/applicantStates', require('./api/applicantState'));
  app.use('/api/jobs', require('./api/job/comment'));
  app.use('/api/jobs', require('./api/job/applicant'));
  app.use('/api/jobAllocations', require('./api/jobAllocation'));
  app.use('/api/jobs', require('./api/job'));
  app.use('/api/applicants', require('./api/applicant'));
  app.use('/api/partners', require('./api/partner'));
  app.use('/api/users', require('./api/user'));



  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
