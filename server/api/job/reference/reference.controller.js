/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/jobs              ->  index
 * POST    /api/jobs              ->  create
 * GET     /api/jobs/:id          ->  show
 * PUT     /api/jobs/:id          ->  update
 * DELETE  /api/jobs/:id          ->  destroy
 */

import fs from 'fs';
import path from 'path';
import db, { Reference, Applicant } from '../../../sqldb';
import config from '../../../config/environment';

function handleError(res, argStatusCode, err) {
  const statusCode = argStatusCode || 500;
  res.status(statusCode).json(err);
}

// Gets a list of References
// cvReceived for a particular job id and for a particular con_id this
export function index(req, res) {
  // Approval Status
  // 0 -> Action Required 1 -> Approved 2 -> Reject 3 -> Duplicate
  Reference.findAll({ where: { job_id: req.params.jobId, con_id: req.user.id } })
    .then(refereneces => res.json(refereneces))
    .catch(err => handleError(res, 500, err));
}

export function getResume(req, res) {
  Reference
    .findById(req.params.id)
    .then(resume => fs
      .readFile(`
      ${config.QDMS_PATH}Welcome/${(resume.id - (resume.id % 10000))}/${resume.id}/${resume.path}`,
        (err, resumeFile) => {
          if (err) return handleError(res, 500, err);
          res.contentType('application/pdf');
          return res.send(resumeFile);
        }))
    .catch(err => handleError(res, 500, err));
}

export function accept(req, res) {
  const jobId = req.params.jobId;
  const referenceId = req.params.id;
  // 27 : Screening Pending 37 : Prescreen Failed
  const stateId = (req.body.approve === true) ? 27 : 37;

  Reference.findById(referenceId)
    .then(reference => db.Applicant.alreadyApplied(db, jobId, reference.email_id, reference.number)
        .then(status => {
          if (status.email === true || status.number === true) {
            const approvalStatus = 3;
            return reference.update({ approval_status: approvalStatus })
              .then(sReference => res.json({ approval_status: sReference.approval_status,
                message: 'Duplicate' }));
          }
          const userId = reference.con_id || req.user.id;
          const file = {
            name: reference.path,
            path: path.join(config.QDMS_PATH, 'Welcome',
              (referenceId - (referenceId % 10000)), referenceId, reference.path),
          };
          return Promise.all([
            db.Employer.findOrCreate({ where: { name: reference.employer } }),
            db.Designation.findOrCreate({ where: { name: reference.designation } }),
            db.Degree.findOrCreate({ where: { degree: reference.higest_qualification } }),
            db.Region.findOrCreate({ where: { region: reference.location } }),
          ]).then(promiseReturns => {
            const employer = promiseReturns[0][0];
            const designation = promiseReturns[1][0];
            const degree = promiseReturns[2][0];
            const region = promiseReturns[3][0];

            const applicant = {
              name: reference.name,
              expected_ctc: reference.expected_salary,
              salary: reference.current_salary,
              notice_period: reference.notice_period,
              total_exp: reference.total_exp,

              number: reference.phone,
              email_id: reference.email,

              employer_id: employer.id, // TODO: Table restructure
              designation_id: designation.id,
              degree_id: degree.id,
              region_id: region.id,
            };

            return Applicant.saveApplicant(db, applicant, file, userId, jobId, stateId)
              .then(rApplicant => {
                let approvalStatus = 1;
                if (stateId === 27) { approvalStatus = 1; }
                if (stateId === 37) { approvalStatus = 2; }
                return reference
                  .update({ approval_status: approvalStatus })
                  .then(rReference => res.json({
                    approval_status: rReference.approval_status,
                    message: (approvalStatus === 1) ? 'Approved' : 'Reject',
                    id: rApplicant.id,
                  }));
              });
          });
        }))
    .catch(err => handleError(res, 500, err));
}
