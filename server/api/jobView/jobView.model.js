'use strict';

module.exports = function JobViewModel(sequelize, DataTypes) {
  const JobView = sequelize.define('JobView', {
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
    tableName: 'job_views',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        JobView.belongsTo(models.Job, {
          foreignKey: 'job_id',
        });

        JobView.belongsTo(models.User, {
          foreignKey: 'user_id',
        });
      },
    },
  });

  return JobView;
};
