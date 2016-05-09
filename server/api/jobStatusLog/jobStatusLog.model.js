

module.exports = function JobStatusLogModel(sequelize, DataTypes) {
  const JobStatusLog = sequelize.define('JobStatusLog', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    created_by: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'created_by field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for created_by field is 11',
        },
      },
      allowNull: false,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'job_status_logs',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {
        JobStatusLog.belongsTo(models.Job, {
          foreignKey: 'job_id',
        });

        JobStatusLog.belongsTo(models.JobStatus, {
          foreignKey: 'job_status_id',
        });
      },
    },
  });

  return JobStatusLog;
};
