'use strict';
const _ = require('lodash');

export default function (sequelize, DataTypes) {

  const Job = sequelize.define('Job', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.STRING(255),
      validate: {
        len: {
          args: [0, 255],
          msg: 'Maximum length for role field is 255',
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      validate: {
        len: {
          args: [0, 255],
          msg: 'Maximum length for email field is 255',
        },
      },
      allowNull: false,
      defaultValue: 'jay@quetzal.in',
    },
    publish_date: DataTypes.DATE,
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
    min_sal: DataTypes.DECIMAL(15, 2),
    max_sal: DataTypes.DECIMAL(15, 2),
    min_exp: {
      type: DataTypes.INTEGER(4),
      validate: {
        isInt: {
          msg: 'min_exp field should be an integer',
        },
        len: {
          args: [0, 4],
          msg: 'Maximum length for min_exp field is 4',
        },
      },
    },
    max_exp: {
      type: DataTypes.INTEGER(4),
      validate: {
        isInt: {
          msg: 'max_exp field should be an integer',
        },
        len: {
          args: [0, 4],
          msg: 'Maximum length for max_exp field is 4',
        },
      },
    },
    priority: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'priority field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for priority field is 11',
        },
      },
    },
    index: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'index field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for index field is 11',
        },
      },
      allowNull: false,
      defaultValue: 0,
    },
    vacancy: {
      type: DataTypes.INTEGER(4),
      validate: {
        isInt: {
          msg: 'vacancy field should be an integer',
        },
        len: {
          args: [0, 4],
          msg: 'Maximum length for vacancy field is 4',
        },
      },
      allowNull: false,
      defaultValue: 1,
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
    created_on: DataTypes.DATE,
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
    job_code: {
      type: DataTypes.STRING(50),
      validate: {
        len: {
          args: [0, 50],
          msg: 'Maximum length for job_code field is 50',
        },
      },
    },
    responsibility: DataTypes.TEXT('long'),
    days_per_week: {
      type: DataTypes.INTEGER(2),
      validate: {
        isInt: {
          msg: 'days_per_week field should be an integer',
        },
        len: {
          args: [0, 2],
          msg: 'Maximum length for days_per_week field is 2',
        },
      },
    },
    start_work_time: {
      type: DataTypes.STRING(9),
      validate: {
        len: {
          args: [0, 9],
          msg: 'Maximum length for start_work_time field is 9',
        },
      },
    },
    end_work_time: {
      type: DataTypes.STRING(9),
      validate: {
        len: {
          args: [0, 9],
          msg: 'Maximum length for end_work_time field is 9',
        },
      },
    },
    preferred_genders: {
      type: DataTypes.STRING(20),
      validate: {
        len: {
          args: [0, 20],
          msg: 'Maximum length for preferred_genders field is 20',
        },
      },
    },
    job_nature: {
      type: DataTypes.STRING(50),
      validate: {
        len: {
          args: [0, 50],
          msg: 'Maximum length for job_nature field is 50',
        },
      },
    },
    interview_addr: {
      type: DataTypes.STRING(255),
      validate: {
        len: {
          args: [0, 255],
          msg: 'Maximum length for interview_addr field is 255',
        },
      },
    },
    direct_line_up: {
      type: DataTypes.STRING(5),
      validate: {
        len: {
          args: [0, 5],
          msg: 'Maximum length for direct_line_up field is 5',
        },
      },
      defaultValue: 'NO',
    },
    interview_place_direction: {
      type: DataTypes.STRING(255),
      validate: {
        len: {
          args: [0, 255],
          msg: 'Maximum length for interview_place_direction field is 5',
        },
      },
    },
    perks: {
      type: DataTypes.STRING(5000),
      validate: {
        len: {
          args: [0, 5000],
          msg: 'Maximum length for perks field is 5000',
        },
      },
    },
    publish_status: {
      type: DataTypes.INTEGER(1),
      validate: {
        isInt: {
          msg: 'publish_status field should be an integer',
        },
        len: {
          args: [0, 1],
          msg: 'Maximum length for publish_status field is 1',
        },
      },
      defaultValue: 1,
    },
    comments: {
      type: DataTypes.STRING(500),
      validate: {
        len: {
          args: [0, 500],
          msg: 'Maximum length for comments field is 500',
        },
      },
    },
    new_job: {
      type: DataTypes.INTEGER(1),
      validate: {
        isInt: {
          msg: 'new_job field should be an integer',
        },
        len: {
          args: [0, 1],
          msg: 'Maximum length for new_job field is 1',
        },
      },
      defaultValue: 0,
    },
  }, {
    tableName: 'jobs',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        Job.belongsTo(models.User, {
          foreignKey: 'user_id',
        });

        Job.belongsTo(models.JobContent, {
          foreignKey: 'job_content_id',
        });

        Job.belongsTo(models.PaymentMethod, {
          foreignKey: 'payment_method_id',
        });

        Job.belongsTo(models.Region, {
          foreignKey: 'region_id',
        });

        Job.belongsTo(models.JobStatus, {
          foreignKey: 'job_status_id',
        });

        Job.belongsTo(models.JobScore, {
          foreignKey: 'job_score_id',
        });

        Job.belongsTo(models.Func, {
          foreignKey: 'func_id',
        });

        Job.belongsToMany(models.Applicant, {
          through: {
            model: models.JobApplication,
            unique: true,
          },
          foreignKey: 'job_id',
          targetKey: 'applicant_id',
        });

        Job.hasMany(models.Notification);
        Job.hasMany(models.JobComment);
        Job.hasMany(models.Referral);
        Job.hasMany(models.JobStatusLog);
        Job.hasMany(models.JobApplication);

        Job.hasMany(models.JobAllocation, {
          defaultScope: {
            where: {status: 1},
          },
        });

        Job.hasMany(models.JobDownload, {
          defaultScope: {
            where: {status: 1},
          },
        });

        Job.hasMany(models.JobSkill, {
          defaultScope: {
            where: {status: 1},
          },
        });

        Job.hasMany(models.JobView, {
          defaultScope: {
            where: {status: 1},
          },
        });

        Job.hasMany(models.JobsDegree, {
          defaultScope: {
            where: {status: 1},
          },
        });

        Job.hasMany(models.JobsEmployer, {
          defaultScope: {
            where: {status: 1},
          },
        });

        Job.hasMany(models.JobsInstitute, {
          defaultScope: {
            where: {status: 1},
          },
        });

        Job.hasMany(models.JobsIndustry, {
          defaultScope: {
            where: {status: 1},
          },
        });
      },
    },

    instanceMethods: {
      updateSolr: function updateSolr(models) {
        const _this = this;
        const quantumData = [

          // Handle undefined _this.JobSkills etc.
          (_this.JobSkills || []).map(s => s.skill_id),
          (_this.JobsDegrees || []).map(s => s.degree_id),
          (_this.JobsInstitutes || []).map(s => s.institute_id),
          (_this.JobsIndustries || []).map(s => s.industry_id),
          (_this.JobsEmployers || []).map(s => s.employer_id),
        ];

        const promises = [];
        ['Skill', 'Degree', 'Institute', 'Industry', 'Employer']
          .forEach(function getData(model, index) {
            promises.push(models[model].findAll({
              where: {
                id: {$in: quantumData[index]},
                system_defined: 1,
              },
            }));
          });

        promises.push(
          models.User.findById(_this.user_id, {
            attributes: ['id', 'client_id'],
            include: [models.Client],
          })
        );

        promises.push(
          models.Region.findById(_this.region_id, {
            attributes: ['id', 'region'],
          })
        );

        Promise.all(promises).then(function getJobData(result) {
          _this.skills = result[0].map(s => s.name);
          _this.degrees = result[1].map(s => s.degree);
          _this.institutes = result[2].map(s => s.name);
          _this.industries = result[3].map(s => s.name);
          _this.employers = result[4].map(s => s.name);
          _this.employers = result[4].map(s => s.name);
          _this.owner_id = result[5].id;
          _this.client_name = result[5].Client.name;
          _this.total_applicants = 0;
          _this.recruiter_username = result[5].username;
          _this.job_location = result[6].region;
          _this.type_s = 'job';
          _this.job_status = 'Open';

          models.Solr.add(_.pick(_this, [
            'updated_on', 'id', 'days_per_week', 'email', 'start_work_time', 'end_work_time',
            'job_nature', 'preferred_genders', 'direct_line_up', 'min_exp', 'role', 'vacancy',
            'min_sal', 'max_sal', 'max_exp', 'responsibility', 'perks', 'interview_addr',
            'interview_place_direction', 'skills', 'degrees', 'institutes', 'industries',
            'employers', 'owner_id', 'client_name', 'total_applicants', 'recruiter_username',
            'job_location', 'type_s', 'job_status',
          ]), function solrJobAdd(err) {
            if (err) return new Error(err);
            models.Solr.softCommit();
          });
        });
      },
    },
  });

  return Job;
};
