

module.exports = function JobDownloadModel(sequelize, DataTypes) {
  const JobDownload = sequelize.define('JobDownload', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
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
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'job_downloads',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {
        JobDownload.belongsTo(models.Job, {
          foreignKey: 'job_id',
        });

        JobDownload.belongsTo(models.User, {
          foreignKey: 'user_id',
        });
      },
    },
  });

  return JobDownload;
};
