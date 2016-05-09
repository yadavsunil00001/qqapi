

module.exports = function JobsInstituteModel(sequelize, DataTypes) {
  const JobsInstitute = sequelize.define('JobsInstitute', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'jobs_institutes',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {
        JobsInstitute.belongsTo(models.Job, {
          foreignKey: 'job_id',
        });

        JobsInstitute.belongsTo(models.Institute, {
          foreignKey: 'institute_id',
        });
      },
    },
  });

  return JobsInstitute;
};
