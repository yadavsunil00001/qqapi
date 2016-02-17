'use strict';

module.exports = function ApplicantScoreLogModel(sequelize, DataTypes) {
  const ApplicantScoreLog = sequelize.define('ApplicantScoreLog', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
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
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'applicant_score_logs',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        ApplicantScoreLog.belongsTo(models.Applicant, {
          foreignKey: 'applicant_id',
        });
      },
    },
  });

  return ApplicantScoreLog;
};
