'use strict';

export default function (sequelize, DataTypes) {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    comment: {
      type: DataTypes.STRING(1024),
      validate: {
        len: {
          args: [0, 1024],
          msg: 'Maximum length for comment field is 1024',
        },
      },
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
    consultant_email_sent: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'consultant_email_sent field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for consultant_email_sent field is 11',
        },
      },
    },
    recruiter_email_sent: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'recruiter_email_sent field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for recruiter_email_sent field is 11',
        },
      },
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_on: DataTypes.DATE,
  }, {
    tableName: 'comments',
    timestamps: false,
    underscored: true,
    defaultScope: {
      where: { status: 1 },
    },

    classMethods: {
      associate: function associate(models) {
        Comment.belongsTo(models.User, {
          foreignKey: 'user_id',
        });

        Comment.belongsTo(models.Applicant, {
          foreignKey: 'applicant_id',
          defaultScope: { order: 'Applicant.id DESC' },
        });
      },
    },
  });

  return Comment;
}
