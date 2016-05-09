/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/applicants              ->  index
 * POST    /api/applicants              ->  create
 * GET     /api/applicants/:id          ->  show
 * PUT     /api/applicants/:id          ->  update
 * DELETE  /api/applicants/:id          ->  destroy
 */



import _ from 'lodash';
import {QueuedTask, Job, JobApplication, Comment, User, ApplicantState, BUCKETS, STAKEHOLDERS} from '../../../sqldb';

function handleError(res, statusCode,err) {
  statusCode = statusCode || 500;
  res.status(statusCode).json(err);
}

// Gets a list of Comments
export function index(req, res) {
//exports.showJobApplicantComments = function getJobApplicantComments(req, res, next) {
  const commentsPromise = Comment.findAll({
    attributes: ['id', ['comment', 'body'], 'user_id', ['created_on', 'created_at']],
    order: [['id', 'DESC']],
    where: { applicant_id: req.params.applicantId },
  });

  const stateCommentsPromise = ApplicantState.findAll({
    attributes: [
      'id', 'state_id', 'user_id', ['updated_on', 'created_at'],
      'suggested_join_date', 'offered_ctc', 'final_ctc', 'scheduled_on',
      ['comments', 'body'], 'currency',
    ],
    order: [['id', 'DESC']],
    where: {
      applicant_id: req.params.applicantId,
      state_id: BUCKETS[STAKEHOLDERS[req.user.group_id]].ALL,
    },
  });

  Promise.all([commentsPromise, stateCommentsPromise])
    .then(function getAllComments(val) {
      const comments = val[0]
        .map(c => c.toJSON())
        .concat(val[1].map(c => c.toJSON()));
      User.findAll({
          attributes: ['id', 'name', 'group_id'],
          where: {
            id: comments.map(c => c.user_id),
          },
        })
        .then(function success(userModels) {
          comments.forEach(function attachUser(comment, index) {
            const user = userModels
              .filter(u => u.id === comment.user_id)[0];
                switch(req.user.group_id){
                  case BUCKETS.GROUPS['CONSULTANTS']:
                    switch (user.group_id) {
                      case 2: // if comment is from consultant then show his details
                      case 5: // if comment is from client then show client details
                        user.name = user.name;
                        break;
                      default: // any other case considered as Quezx Users
                        user.name = 'QuezX';
                        break;
                    }
                    break;
                  case BUCKETS.GROUPS['INTERNAL_TEAM']:
                    user.name = user.name;
                    break;
                  default:
                    break;
                }

            // Customized commenter naming to be viewed by recruiters


            comments[index].user = _.pick(user, ['id', 'name']);
          });

          res.json(comments);
        });
    })
    .catch(err => handleError(res,500,err));
};


export function create(req, res) {
//exports.createJobApplicantComments = function createJobApplicantComments(req, res, next) {
  Comment
    .build(req.body)
    .set('applicant_id', req.params.applicantId)
    .set('user_id', req.user.id)
    .save()
    .then(c => {
      res.status(201).json(_.pick(c, ['id', 'status']));

      // @todo Use Solr to get Details
      JobApplication.findOne({
          where: { applicant_id: c.applicant_id },
          attributes: ['id'],
          include: [
            {
              model: Job,
              attributes: ['role', 'user_id'],
            },
            {
              model: Applicant,
              attributes: ['name', 'user_id'],
            },
          ],
        })
        .then(j => {
          // j => jobApplication
          User.findAll({
              // get applicant and job related fields
              where: { id: [j.Applicant.user_id, j.Job.user_id] },
              attributes: ['id'],
              include: [
                {
                  // Get Consultant and Recruiter Clients
                  model: Client,
                  attributes: ['name'],
                  include: [
                    {
                      // Get engagement manager emails
                      model: User,
                      as: 'EngagementManager',
                      attributes: ['email_id'],
                    },
                  ],
                },
              ],
            })
            .then(user => {
              QueuedTask.applicantCommentNotify({
                comment: c.comment,
                applicant: { id: c.applicant_id, name: j.Applicant.name },
                job: { role: j.Job.role, client: user.find(u => u.id === j.Job.user_id).Client.name },
                emails: user.map(u => u.Client.EngagementManager.email_id),
              });
            });
        })
        .catch(logger.error);
    })
    .catch(err => handleError(res,500,err));
};


