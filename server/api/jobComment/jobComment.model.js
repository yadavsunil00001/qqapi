'use strict';

export default function (sequelize, DataTypes) {
  const JobComment = sequelize.define('JobComment', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'job_comments',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        JobComment.belongsTo(models.User, {
          foreignKey: 'user_id',
        });

        JobComment.belongsTo(models.Job, {
          foreignKey: 'job_id',
        });
      },
    },
  });

  return JobComment;
}
