'use strict';

module.exports = function JobApplicationModel(sequelize, DataTypes) {
  const JobApplication = sequelize.define('JobApplication', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'job_applications',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        JobApplication.belongsTo(models.Job, {
          foreignKey: 'job_id',
          defaultScope: {
            where: { status: 1 },
          },
        });

        JobApplication.belongsTo(models.Applicant, {
          foreignKey: 'applicant_id',
          defaultScope: {
            where: { status: 1 },
          },
        });
      },
    },
  });

  return JobApplication;
};
