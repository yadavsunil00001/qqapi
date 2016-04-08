'use strict';

import _ from 'lodash';
import fsp from 'fs-promise';
import mkdirp from 'mkdirp-then';
import path from 'path';
import config from './../../config/environment';
import phpSerialize from './../../components/php-serialize';

export default function (sequelize, DataTypes) {
  const Applicant = sequelize.define('Applicant', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      validate: {
        len: {
          args: [0, 100],
          msg: 'Maximum length for name field is 100',
        },
      },
    },
    total_exp: DataTypes.DECIMAL(15, 2),
    expected_ctc: DataTypes.DECIMAL(15, 2),
    notice_period: {
      type: DataTypes.INTEGER(6),
      validate: {
        isInt: {
          msg: 'notice_period field should be an integer',
        },
        len: {
          args: [0, 6],
          msg: 'Maximum length for notice_period field is 6',
        },
      },
    },
    quezx_id: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'quezx_id field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for quezx_id field is 11',
        },
      },
    },
    status: {
      type: DataTypes.INTEGER(1),
      validate: {
        isInt: {
          msg: 'status field should be an integer',
        },
        len: {
          args: [0, 1],
          msg: 'Maximum length for status field is 1',
        },
      },
      defaultValue: 1,
    },
    verified: {
      type: DataTypes.INTEGER(4),
      validate: {
        isInt: {
          msg: 'verfied field should be an integer',
        },
        len: {
          args: [0, 4],
          msg: 'Maximum length for verified field is 4',
        },
      },
      defaultValue: 0,
    },
    score: {
      type: DataTypes.INTEGER(4),
      validate: {
        isInt: {
          msg: 'score field should be an integer',
        },
        len: {
          args: [0, 4],
          msg: 'Maximum length for score field is 4',
        },
      },
    },
    created_by: {
      type: DataTypes.INTEGER(14),
      validate: {
        isInt: {
          msg: 'created_by field should be an integer',
        },
        len: {
          args: [0, 14],
          msg: 'Maximum length for created_by field is 14',
        },
      },
    },
    created_at: DataTypes.DATE,
    updated_by: {
      type: DataTypes.INTEGER(14),
      validate: {
        isInt: {
          msg: 'updated_by field should be an integer',
        },
        len: {
          args: [0, 14],
          msg: 'Maximum length for updated_by field is 14',
        },
      },
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    parent_id: {
      type: DataTypes.INTEGER(10),
      validate: {
        isInt: {
          msg: 'parent_id field should be an integer',
        },
        len: {
          args: [0, 10],
          msg: 'Maximum length for parent_id field is 10',
        },
      },
    },
    state_id: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'state_id field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for state_id field is 11',
        },
      },
      defaultValue: 1,
      allowNull: false,
    },
    screening_state_id: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'screening_state_id field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for screening_state_id field is 11',
        },
      },
    },
    applicant_screening_id: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'applicant_screening_id field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for applicant_screening_id field is 11',
        },
      },
      unique: true,
    },
  }, {
    tableName: 'applicants',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        Applicant.belongsTo(models.User, {
          foreignKey: 'user_id',
        });

        Applicant.belongsTo(models.ApplicantState, {
          defaultScope: {
            where: {status: 1},
          },
          foreignKey: 'applicant_state_id',
        });

        Applicant.belongsToMany(models.Job, {
          through: {
            model: models.JobApplication,
            unique: true,
          },
          foreignKey: 'applicant_id',
          targetKey: 'job_id',
        });

        Applicant.hasMany(models.ApplicantDownload, {
          defaultScope: {
            where: {status: 1},
          },
        });

        Applicant.hasMany(models.ApplicantSkill, {
          defaultScope: {
            where: {status: 1},
          },
        });

        Applicant.hasMany(models.ApplicantView, {
          defaultScope: {
            where: {status: 1},
          },
        });

        Applicant.hasMany(models.Comment, {
          defaultScope: {
            where: {status: 1},
          },
        });

        Applicant.hasMany(models.Education, {
          defaultScope: {
            where: {status: 1},
            limit: 1,
            order: 'id DESC',
          },
        });

        Applicant.hasMany(models.Email, {
          defaultScope: {
            where: {status: 1},
            limit: 1,
            order: 'id DESC',
          },
        });

        Applicant.hasMany(models.Experience, {
          defaultScope: {
            where: {status: 1},
            limit: 1,
            order: 'id DESC',
          },
        });

        Applicant.hasMany(models.JobApplication, {
          defaultScope: {
            where: {status: 1},
          },
        });

        Applicant.hasMany(models.PhoneNumber, {
          defaultScope: {
            where: {status: 1},
            limit: 1,
            order: 'id DESC',
          },
        });

        Applicant.hasMany(models.Resume, {
          defaultScope: {
            where: {status: 1},
            limit: 1,
            order: 'id DESC',
          },
        });

        Applicant.hasMany(models.Notification, {
          defaultScope: {
            limit: 1,
            order: 'id DESC',
          },
        });

        Applicant.hasMany(models.ApplicantScoreLog, {
          defaultScope: {
            where: {status: 1},
            limit: 1,
            order: 'id DESC',
          },
        });

        Applicant.hasMany(models.Referral);

        Applicant.hasOne(models.ApplicantPreferenceTime, {
          defaultScope: {
            limit: 1
          }
        });
      },
      validateEmailId(models, jobId, email) {
        if (!models) return Promise.reject({code: 500, desc: "validateEmailId: models not found"})
        if (!jobId) return Promise.reject({code: 500, desc: "validateEmailId: jobId not found"})
        if (!email) return Promise.reject({code: 500, desc: "validateEmailId: email not found"})

        return models.JobApplication.findAll({
          attributes: ['id'],
          where: {job_id: jobId},
          include: [{
            model: models.Applicant,
            attributes: ['id'],
            include: [{model: models.Email, attributes: ['id'], where: {email: email, status: 1}}]
          }]
        }).then(rows => {
          if (rows.length > 0) return Promise.resolve(true)
          return Promise.resolve(false)
        })
      },
      validatePhoneNumber(models, jobId, number) {
        if (!models) return Promise.reject({code: 500, desc: "validatePhoneNumber: models not found"})
        if (!jobId) return Promise.reject({code: 500, desc: "validatePhoneNumber: jobId not found"})
        if (!number) return Promise.reject({code: 500, desc: "validatePhoneNumber: number not found"})
        return models.JobApplication.findAll({
          attributes: ['id'],
          where: {job_id: jobId},
          include: [{
            model: models.Applicant,
            attributes: ['id'],
            include: [{model: models.PhoneNumber, attributes: ['id'], where: {number: number, status: 1}}]
          }]
        }).then(rows => {
          if (rows.length > 0) return Promise.resolve(true)
          return Promise.resolve(false)
        })
      },
      alreadyApplied(models, jobId, emailId, number){
        // TODO Validatio for email id and phone number for same job

        return Promise.all([
            emailId ? models.Applicant.validateEmailId(models, jobId, emailId) : Promise.resolve(false),
            number ? models.Applicant.validatePhoneNumber(models, jobId, number) : Promise.resolve(false)
          ])
          .then(validationResultArray => {
            return {email: validationResultArray[0], number: validationResultArray[1]}
          })
      },
      saveApplicant(models, applicantToSave, file, userId, jobId, stateId) {
        if (!models) return Promise.reject({code: 500, desc: "saveApplicant: models not found"})
        if (!applicantToSave) return Promise.reject({code: 500, desc: "saveApplicant: Applicant details"})
        if (!userId) return Promise.reject({code: 500, desc: "saveApplicant: userId not found"})
        if (!jobId) return Promise.reject({code: 500, desc: "saveApplicant:  jobId not found"})
        if (!file) return Promise.reject({code: 500, desc: "saveApplicant: file not found"})
        stateId = stateId || 27; // Screening Pending
        applicantToSave.institute_id = applicantToSave.institute_id || 1; //

        return models.Applicant.alreadyApplied(models, jobId, applicantToSave.email_id, applicantToSave.number)
          .then(status => {
            if (status.email === true || status.number === true) return Promise.reject(_.extend({
              code: 409,
              message: "phone or email conflict"
            }, status))
            return models.Applicant.build(_.pick(applicantToSave, ['name', 'expected_ctc', 'salary', 'notice_period', 'total_exp']), {
                include: [models.PhoneNumber, models.Email, models.Education, models.JobApplication,
                  models.ApplicantState, models.Experience, models.Resume] // Resume added to retrive
              })
              .set('user_id', userId)
              //.set('created_at',)
              .set('created_by', userId)
              .set('updated_by', userId)
              .set('Emails', {email: applicantToSave.email_id})
              .set('Education', {degree_id: applicantToSave.degree_id, institute_id: applicantToSave.institute_id})
              .set('PhoneNumbers', {number: applicantToSave.number})
              .set('JobApplications', {job_id: jobId})
              .set('Experiences', {
                region_id: applicantToSave.region_id,
                employer_id: applicantToSave.employer_id,
                designation_id: applicantToSave.designation_id,
                salary: applicantToSave.salary,
              })
              .save()
              .then(function (applicant) {
                const applicantStateToSave = {state_id: stateId, user_id: userId, applicant_id: applicant.id}
                return models.ApplicantState
                  .create(applicantStateToSave)
                  .then(applicantState => {
                    models.ApplicantScreening.legacyMap(models, [applicantStateToSave], userId).then(re => {
                      console.log(`User: ${userId}, legacyMap for applicant:${applicant.id} - done`)
                    }).catch(err => {
                      console.log(`User: ${userId}, legacyMap for applicant:${JSON.stringify(applicantStateToSave)} - Error`)
                    })
                    models.Job.findById(jobId).then(job => {
                      if (job.direct_line_up == 1) {
                        const awf = {
                          state_id: 1,
                          user_id: 1,
                          applicant_id: applicant.id,
                          comments: 'Automated'
                        }

                        models.ApplicantState.updateState(models, awf, userId);
                        models.ApplicantScreening.legacyMap(models, [awf], userId);

                        const cvs = {
                          state_id: 19,
                          user_id: 1,
                          applicant_id: applicant.id,
                          comments: 'Direct-Line-Up auto-shortlist'
                        }
                        models.ApplicantState.updateState(models, cvs, userId);
                      }
                      const processApplicantCharactersticksPr = models.Applicant.processApplicantCharactersticks(models, applicant.id, job.id).then(re => {
                        console.log("Success:processApplicantCharactersticks,extractApplicant, updateScore, updateStates", applicant.id, job.id)
                      }).catch(err => {
                        console.log("Success:processApplicantCharactersticks,extractApplicant, updateScore, updateStates", applicant.id, job.id, err)
                      });
                      return "Async Return"

                    }).catch(err => {
                      return console.log("Error while getting job for id", jobId, err)
                    })


                    const applicantIdLowerRoundOff = (applicant.id - (applicant.id % 10000)).toString();
                    let absoluteFolderPathToSave = path.join(config.QDMS_PATH, "Applicants", applicantIdLowerRoundOff, applicant.id.toString()) + "/";
                    let fileName = file.name;

                    // Todo: Copy is better than read and write
                    const resumePromise = fsp.readFile(file.path).then(function (fileStream) {
                      return mkdirp(absoluteFolderPathToSave).then(function () {
                        let fileExtension = fileName.split(".").pop(); // Extension
                        let allowedExtType = ['doc', 'docx', 'pdf', 'rtf', 'txt'];
                        if (allowedExtType.indexOf(fileExtension.toLowerCase()) === -1) {
                          return Promise.reject({code: 500, desc: "File Type Not Allowed"});
                        }
                        let absoluteFilePath = absoluteFolderPathToSave + applicant.id + "." + fileExtension;
                        return fsp.writeFile(absoluteFilePath, fileStream).then(function () {
                          return models.Resume.create({
                            applicant_id: applicant.id,
                            contents: 'Please wait the file is under processing',
                            path: path.join('Applicants/', applicantIdLowerRoundOff, applicant.id.toString(), [applicant.id, fileExtension].join("."))
                          }).then(re => {
                            const data = phpSerialize.serialize({
                              command: `${config.QUARC_PATH}app/Console/cake`,
                              params: [
                                'beautify_file',
                                '-t', 'a',
                                '-i', applicant.id,
                              ],
                            });

                            models.QueuedTask.create({jobType: 'Execute', group: 'conversion', data}).then(re => {
                              console.log(applicant.id + ": Applicant Resume Conversion queued task created")
                            }).catch(err => {
                              console.log(applicant.id + ": Applicant Resume Conversion queued task creation error: ", err)
                            });
                            return re
                          });
                        });
                      });
                    });

                    return Promise.all([
                      applicant.update({applicant_state_id: applicantState.id}),
                      resumePromise
                    ]).then(function (promiseReturns) {
                      var applicant = promiseReturns[0];
                      // Async: Not returned
                      models.Applicant.sendWelcomeEmail(models, applicant.id).then(re => {
                        console.log("sendWelcomeEmailQueued Task created", applicant.id)
                      }).catch(err => {
                        console.log(" sendWelcomeEmail Email Queue Error", applicant.id, err)
                      })
                      applicant.updateSolr(models, userId, jobId).then(re => {
                        console.log("applicant indexed")
                      }).catch(err => {
                        console.log("solr index failed", err)
                      })
                      return applicant;
                    })
                  })
              })
          })
      },
      sendWelcomeEmail: function (models, id) {
        var datetime = {
          applicant_id: id,
          hash: this.generatehash(50)
        };
        return models.ApplicantPreferenceTime.build(datetime).save().then(applicantPreferenceTime => {
          return models.Applicant.findOne({
            attributes: ['id', 'name', 'expected_ctc', 'total_exp', 'user_id', 'notice_period'],
            where: {
              id: id,
            },
            include: [
              {
                model: models.Experience,
                attributes: ['employer_id', 'designation_id', 'region_id', 'salary'],
                include: [
                  //{model: models.Employer, attributes: ['name']}, // Quantum
                  //{model: models.Designation, attributes: ['name']}, // Quantum
                  //{model: models.Region, attributes: ['region']} // Qunatum
                ]
              },
              {model: models.Email, attributes: ['email']},
              {model: models.PhoneNumber, attributes: ['number']},
              {
                model: models.Education, attributes: ['degree_id']
                //, include: [{model: models.Degree, attributes: ['degree']}] // Quantum
              },
              {
                model: models.JobApplication, attributes: ['id'],
                required: false,
                include: [{
                  model: models.Job, attributes: ['role', 'job_content_id', 'user_id', 'id'],
                  include: [
                    {model: models.JobContent, attributes: ['path']},
                  ]
                }]
              },
              {model: models.Resume, attributes: ['path']},
              {model: models.ApplicantPreferenceTime},
            ]
          }).then(applicant => {
            return Promise.all([
              (applicant.Education[0] ? models.Degree.find({
                attributes: ['degree'],
                where: {id: _.get(applicant.Education[0], 'degree_id')}
              }) : [] ),
              (applicant.Experiences[0] ? models.Employer.find({
                attributes: ['name'],
                where: {id: _.get(applicant.Experiences[0], 'employer_id')}
              }) : []),
              (applicant.Experiences[0] ? models.Designation.find({
                attributes: ['name'],
                where: {id: _.get(applicant.Experiences[0], 'designation_id')}
              }) : []),
              (applicant.Experiences[0] ? models.Region.find({
                where: {id: _.get(applicant.Experiences[0], 'region_id')},
                include: [models.Province],
                attributes: ['region'],
              }) : []),
              // Applicant Owner - Consultant
              models.User.find({
                attributes: ['id', 'name', 'username'], where: {id: applicant.user_id},
                include: [{attributes: ['id', 'name', 'eng_mgr_id'], model: models.Client}]
              }),
              // Job Owner - Company
              models.User.find({
                attributes: ['name', 'username'],
                where: {id: applicant.JobApplications[0].Job.user_id}
              }),
            ]).then(promiseReturns => {
              var plainApplicant = applicant.toJSON();
              if (plainApplicant.Education[0]) plainApplicant.Education[0].Degree = typeof promiseReturns[0] == 'object' ? promiseReturns[0].toJSON() : {};
              if (plainApplicant.Experiences[0]) {
                plainApplicant.Experiences[0].Employer = typeof promiseReturns[1] == 'object' ? promiseReturns[1].toJSON() : {};
                plainApplicant.Experiences[0].Designation = typeof promiseReturns[2] == 'object' ? promiseReturns[2].toJSON() : {};
                plainApplicant.Experiences[0].Region = typeof promiseReturns[3] == 'object' ? promiseReturns[3].toJSON() : {};
              }

              plainApplicant.User = typeof promiseReturns[4] == 'object' ? promiseReturns[4].toJSON() : {};
              if (plainApplicant.JobApplications[0]) plainApplicant.JobApplications[0].Job.User = typeof promiseReturns[4] == 'object' ? promiseReturns[4].toJSON() : {};

              var jobContentFilePath = plainApplicant.JobApplications[0].Job.JobContent.path ? config.QDMS_PATH + plainApplicant.JobApplications[0].Job.JobContent.path : null;
              var jobContentFileExt = jobContentFilePath ? jobContentFilePath.split(".") : null;

              var resumeFilePath = applicant.Resumes[0] ? (applicant.Resumes[0].path ? (config.QDMS_PATH + applicant.Resumes[0].path) : "") : null;
              var resumeExt = resumeFilePath ? resumeFilePath.split(".") : null;

              var file1 = jobContentFileExt.length ? 'Job_Description.' + jobContentFileExt[1] : "";
              var file2 = resumeExt.length ? 'Your_Resume.' + resumeExt[1] : "";

              var attachments = [{}];
              if (file1) {
                attachments[0][file1] = jobContentFilePath
              }
              if (file2) {
                attachments[0][file2] = resumeFilePath
              }

              //Mail to Applicant
              var subject = 'QuezX.com - Application for ' + plainApplicant.JobApplications[0].Job.User.name + ' - ' + plainApplicant.JobApplications[0].Job.role;

              var emailData = {
                settings: {
                  subject: subject,
                  to: _.get(plainApplicant.Emails[0],'email'),
                  bcc: "quezx@quetzal.in",
                  replyTo: "candidate-upload@quezx.com",
                  from: ["notifications@quezx.com", "QuezX.com"],
                  domain: "Quezx.com",
                  attachments: attachments,
                  template: ["email_candidate"]
                },
                "vars": {
                  "details": {
                    "Applicant": _.pick(plainApplicant, ["name", "expected_ctc", "total_exp", "user_id", "notice_period", "id"]),
                    "User": _.pick(plainApplicant.User, ["name", "username"]),
                    "ApplicantPreferenceTime": plainApplicant.ApplicantPreferenceTime,
                    "Education": plainApplicant.Education,
                    "Email": plainApplicant.Emails,
                    "Experience": plainApplicant.Experiences,
                    "JobApplication": plainApplicant.JobApplications,
                    "PhoneNumber": plainApplicant.PhoneNumbers,
                    "Resume": plainApplicant.Resumes
                  },
                  "appid": id
                }
              }

              const data = phpSerialize.serialize(emailData);

              const task = {
                jobType: 'Email',
                group: 'high',
                data,
              };

              const sendMailToCandidatePromise = models.QueuedTask.create(task)

              const sendMailToConsultantEMPromise = models.User.find({where: {id: plainApplicant.User.Client.eng_mgr_id}}).then(consultantEm => {
                var msg = plainApplicant.User.username + ' has uploaded a CV <br>';
                msg += 'Name: ' + plainApplicant.name + '<br>';
                msg += 'Client: ' + plainApplicant.JobApplications[0].Job.User.name + '<br>';
                msg += 'Position: ' + plainApplicant.JobApplications[0].Job.role + '<br>';
                msg += 'You can manage the applicants here <a href="' +
                  (config.URLS.QUARC_UI_PARTNER || "https://partner.quezx.com") + 'applicants/' +
                  id + '"> View Aplicant</a>';

                var emailInternals = {
                  'settings': {
                    'subject': 'New Candidate Upload',
                    'to': consultantEm.email_id,
                    'bcc': 'quezx@quetzal.in',
                    'emailFormat': 'html',
                    'from': ['notifications@quezx.com', 'Candidate Upload'],
                    'domain': 'Quezx.com',
                  },
                  'vars': {
                    'content': msg
                  }
                };

                var internalData = phpSerialize.serialize(emailInternals);
                const internalTask = {
                  jobType: 'Email',
                  group: 'email',
                  data: internalData,
                };
                return models.QueuedTask.create(internalTask);
              });

              return Promise.all([
                sendMailToCandidatePromise,
                sendMailToConsultantEMPromise,
              ]);
            })
          });
        })
      },
      // Todo: generate hash to be replaced by some library for more robust and simple code
      generatehash(length) {
        var length = length || 150;
        var characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var charactersLength = characters.length;
        var randomString = '';
        for (var i = 0; i < length; i++) {
          randomString += characters[Math.floor((Math.random() * (charactersLength - 1)))];
        }
        return randomString;
      },
      processApplicantCharactersticks(models, id, jobId) {

        const extractApplicant = phpSerialize.serialize({
          command: `${config.QUARC_PATH}app/Console/cake`,
          params: [
            'extract_applicant',
            '-a', id,
          ],
        });

        const updateScore = phpSerialize.serialize({
          command: `${config.QUARC_PATH}app/Console/cake`,
          params: [
            'update_score',
            '-j', jobId,
          ],
        });

        const updateStates = phpSerialize.serialize({
          command: `${config.QUARC_PATH}app/Console/cake`,
          params: [
            'update_status',
            '-i', id,
          ],
        });

        return Promise.all([
          models.QueuedTask.create({jobType: 'Execute', group: 'low', data: extractApplicant}),
          models.QueuedTask.create({jobType: 'Execute', group: 'low', data: updateScore}),
          models.QueuedTask.create({jobType: 'Execute', group: 'low', data: updateStates})])

      }
    },
    instanceMethods: {
      updateSolr(db, userId, jobId) {
        const _this = this;

        if (!db) return Promise.reject("updateSolr: db not defined")
        if (!userId) return Promise.reject("updateSolr: userId not defined")
        if (!jobId) return Promise.reject("updateSolr: jobId not defined")

        // Todo: _this is current applicant, No need to query again
        return db.Applicant.find({
          attributes: ['id', 'name', 'total_exp', 'expected_ctc', 'notice_period', ['score', 'applicant_score'], 'verified'
            , ['created_at', 'created_on'], 'updated_on', ['user_id', 'owner_id']],
          where: {id: _this.id},
          include: [
            {model: db.PhoneNumber, attributes: ['number']},
            {model: db.Email, attributes: ['email']},
            {model: db.Comment, attributes: ['comment'], order: 'updated_on DESC', required: false},
            {model: db.Resume, attributes: ['contents']},
            {model: db.Education, attributes: ['degree_id', 'institute_id']},
            {model: db.JobApplication, attributes: [], include: [{model: db.Job, attributes: []}]},
            {model: db.ApplicantState, include: [{model: db.State, attributes: ['name']}], attributes: ['state_id']},
            {model: db.ApplicantSkill, attributes: ['skill_id']}
          ]
        }).then(function (applicant) {
          if (!applicant)  return Promise.reject("Candidate not found while updating to solr")

          const experiancePromise = db.Experience.find({
            where: {applicant_id: _this.id},
            raw: true
          }).then(experiance => {
            var experiancePromises = [
              db.Region.findById(experiance.region_id),
              db.Employer.findById(experiance.employer_id),
              db.Designation.findById(experiance.designation_id)
            ]

            return Promise.all(experiancePromises).then(resolvedPromise => {
              const region = resolvedPromise[0] || {};
              const employer = resolvedPromise[1] || {};
              const designation = resolvedPromise[2] || {};
              experiance.region = region.region
              experiance.employer = employer.name
              experiance.designation = designation.name
              return experiance
            })
          })

          var latestCommentQuery = `
            (SELECT comment AS latest_comment, updated_on AS LC_updated_on FROM comments WHERE (applicant_id = ${applicant.id}) AND (status = 1) ORDER BY id DESC LIMIT 1)
            UNION
            (SELECT comments AS latest_comment, updated_on AS LC_updated_on FROM applicant_states WHERE applicant_id = ${applicant.id} ORDER BY id DESC LIMIT 1)
            ORDER BY LC_updated_on DESC LIMIT 1`;

          // For Feteching skills
          var skillIds = applicant.ApplicantSkills.map(skill => skill.skill_id)

          var promises = [
            (applicant.Education.length ? db.Degree.findById(applicant.Education[0].degree_id) : []),
            (applicant.Education.length ? db.Institute.findById(applicant.Education[0].institute_id) : []),
            db.User.find({where: {id: userId}, include: [db.Client], raw: true}), // Current Consultant and Client Details
            db.sequelizeQuarc.query(latestCommentQuery, {type: db.Sequelize.QueryTypes.SELECT}),
            db.Skill.findAll({where: {id: {$in: skillIds}, system_defined: 1,}, raw: true}),
            experiancePromise
          ];

          return Promise.all(promises).then(resolvedPromise => {
            const degree = resolvedPromise[0];
            const institute = resolvedPromise[1];
            var client = resolvedPromise[2]
            const latestComment = resolvedPromise[3].comment;
            const simpleSkills = resolvedPromise[4].map(skill => skill.name)
            const experience = resolvedPromise[5]
            var engagementManagerId = client['Client.eng_mgr_id']

            return db.User.find({where: {id: engagementManagerId}, attributes: ['name'], raw: true}).then(engMgr => {
              var solrRecord = {
                "updated_on": applicant.updated_on,
                "type_s": "applicant",
                // Todo: .user_id is found in previousDatavalues of applicant, so currently taken from _this
                "owner_id": applicant.user_id || _this.user_id,
                "mobile": _.get(applicant.PhoneNumbers[0], 'number'),
                "verified": applicant.verified,
                "applicant_score": applicant.score,
                "expected_ctc": applicant.expected_ctc,
                "state_name": applicant.ApplicantState.State.get('name'),
                "created_on": applicant.created_on,
                "name": applicant.name,
                "id": applicant.id,
                "state_id": applicant.applicant_state_id,
                "notice_period": applicant.notice_period,
                "total_exp": applicant.total_exp,
                "email": applicant.Emails.length ? applicant.Emails[0].email : '',
                "latest_comment": latestComment,

                "consultant_username": client.name,
                "eng_mgr_name": engMgr.name,
                "client_name": client['Client.name'],

                "skills": simpleSkills,
                "edu_institute": institute.name,
                "edu_degree": degree.degree,
                "exp_salary": experience.salary,
                "exp_designation": experience.designation,
                "exp_location": experience.region,
                "exp_employer": experience.employer,
                "_root_": jobId
              };

              return db.Solr.add(solrRecord, function solrJobAdd(err) {
                if (err) return Promise.reject(err);
                return db.Solr.softCommit();
              });
            })
          })
        })
      },
    }
  });

  return Applicant;
}
