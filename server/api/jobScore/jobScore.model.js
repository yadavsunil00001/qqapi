'use strict';
module.exports = function JobScoreModel(sequelize, DataTypes) {
  const JobScore = sequelize.define('JobScore', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    job_id: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'job_id field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for job_id field is 11',
        },
      },
      allowNull: false,
    },
    consultant: DataTypes.FLOAT(15, 2),
    client: DataTypes.FLOAT(15, 2),
    screening: DataTypes.FLOAT(15, 2),
    count_feedbacks: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'count_feedbacks field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for count_feedbacks field is 11',
        },
      },
      allowNull: false,
    },
    count_interviews: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'count_interviews field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for count_interviews field is 11',
        },
      },
      allowNull: false,
    },
    count_rejects: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'count_rejects field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for count_rejects field is 11',
        },
      },
      allowNull: false,
    },
    count_holds: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'count_holds field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for count_holds field is 11',
        },
      },
      allowNull: false,
    },
    count_unscreened: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'count_unscreened field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for count_unscreened field is 11',
        },
      },
      allowNull: false,
    },
    count_not_sent: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'count_not_sent field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for count_not_sent field is 11',
        },
      },
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'job_scores',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        JobScore.hasMany(models.Job);
      },
    },
  });

  return JobScore;
};
