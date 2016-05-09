

module.exports = function JobContentModel(sequelize, DataTypes) {
  const JobContent = sequelize.define('JobContent', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    path: {
      type: DataTypes.STRING(255),
      validate: {
        len: {
          args: [0, 255],
          msg: 'Maximum length for path field is 255',
        },
      },
    },
    contents: DataTypes.TEXT('medium'),
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
    tableName: 'job_contents',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {
        JobContent.hasMany(models.Job, {
          foreignKey: 'job_content_id',
        });
      },
    },
  });

  return JobContent;
};
