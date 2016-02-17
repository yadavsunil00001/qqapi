'use strict';

module.exports = function NotificationModel(sequelize, DataTypes) {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    message: {
      type: DataTypes.STRING(255),
      validate: {
        len: {
          args: [0, 255],
          msg: 'Maximum length for message field is 255',
        },
      },
    },
    redirect: {
      type: DataTypes.STRING(255),
      validate: {
        len: {
          args: [0, 255],
          msg: 'Maximum length for redirect field is 255',
        },
      },
    },
    notification_type_id: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'notification_type_id field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for notification_type_id field is 11',
        },
      },
      defaultValue: 1,
    },
    email_sent: {
      type: DataTypes.INTEGER(1),
      validate: {
        isInt: {
          msg: 'email_sent field should be an integer',
        },
        len: {
          args: [0, 1],
          msg: 'Maximum length for email_sent field is 1',
        },
      },
      allowNull: false,
      defaultValue: 0,
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
    created_on: DataTypes.DATE,
    updated_by: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'updated_by field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for updated_by field is 11',
        },
      },
      allowNull: false,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'notifications',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        Notification.belongsTo(models.User, {
          foreignKey: 'user_id',
        });

        Notification.belongsTo(models.Job, {
          foreignKey: 'job_id',
        });

        Notification.belongsTo(models.State, {
          foreignKey: 'state_id',
        });

        Notification.belongsTo(models.Applicant, {
          foreignKey: 'applicant_id',
        });
      },
    },
  });

  return Notification;
};
