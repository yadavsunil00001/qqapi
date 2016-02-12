'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Applicant', {
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
            where: { status: 1 },
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
            where: { status: 1 },
          },
        });

        Applicant.hasMany(models.ApplicantSkill, {
          defaultScope: {
            where: { status: 1 },
          },
        });

        Applicant.hasMany(models.ApplicantView, {
          defaultScope: {
            where: { status: 1 },
          },
        });

        Applicant.hasMany(models.Comment, {
          defaultScope: {
            where: { status: 1 },
          },
        });

        Applicant.hasMany(models.Education, {
          defaultScope: {
            where: { status: 1 },
            limit: 1,
            order: 'id DESC',
          },
        });

        Applicant.hasMany(models.Email, {
          defaultScope: {
            where: { status: 1 },
            limit: 1,
            order: 'id DESC',
          },
        });

        Applicant.hasMany(models.Experience, {
          defaultScope: {
            where: { status: 1 },
            limit: 1,
            order: 'id DESC',
          },
        });

        Applicant.hasMany(models.JobApplication, {
          defaultScope: {
            where: { status: 1 },
          },
        });

        Applicant.hasMany(models.PhoneNumber, {
          defaultScope: {
            where: { status: 1 },
            limit: 1,
            order: 'id DESC',
          },
        });

        Applicant.hasMany(models.Resume, {
          defaultScope: {
            where: { status: 1 },
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
            where: { status: 1 },
            limit: 1,
            order: 'id DESC',
          },
        });

        Applicant.hasMany(models.Referral);
      },
    },
  });
}
