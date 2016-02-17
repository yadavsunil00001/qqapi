'use strict';

module.exports = function JobsEmployerModel(sequelize, DataTypes) {
  const JobsEmployer = sequelize.define('JobsEmployer', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'jobs_employers',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        JobsEmployer.belongsTo(models.Job, {
          foreignKey: 'job_id',
        });

        JobsEmployer.belongsTo(models.Employer, {
          foreignKey: 'employer_id',
        });
      },
    },
  });

  return JobsEmployer;
};
