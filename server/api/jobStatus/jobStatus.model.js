

module.exports = function JobStatusModel(sequelize, DataTypes) {
  const JobStatus = sequelize.define('JobStatus', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(20),
      validate: {
        isInt: {
          msg: 'name field should be an integer',
        },
        len: {
          args: [0, 20],
          msg: 'Maximum length for name field is 20',
        },
      },
      allowNull: false,
    },
  }, {
    tableName: 'job_statuses',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {
        JobStatus.hasMany(models.Job);
      },
    },
  });

  return JobStatus;
};
