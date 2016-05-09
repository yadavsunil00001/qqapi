module.exports = function NotificationModel(sequelize, DataTypes) {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    message: { type: DataTypes.STRING(10000) },
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
      associate(models) {
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

    instanceMethods: {

      /**
       * Notify user for Applicant State Change
       * This methods requires user_id field to be set before calling
       * @param  {Object}   notify                   Email config and data
       * @param  {Object}   notify.applicant         Applicant details
       * @param  {Number}   notify.applicant.id      Applicant id
       * @param  {String}   notify.applicant.name    Applicant name
       * @param  {Object}   notify.applicant.creator Applicant Creator
       * @param  {Object}   notify.state             State Object
       * @param  {String}   notify.state.name        State name
       * @param  {String}   notify.state.comment     State change comment
       * @param  {Object}   notify.job               Job Profile
       * @param  {String}   notify.job.role          Job position name
       * @param  {Object}   notify.job.creator Job Creator
       * @return {Promise.<number>} Return promise for inseration of row in QueuedTask
       */
      changeStateNotify: function changeStateNotify(notify) {
        const _this = this;
        _this
          .set('message',
            `Candidate Name :
              <a href="//${notify.server}/Applicants/view/${notify.applicant.id}">
                ${notify.applicant.name}
              </a>
            Position : ${notify.job.role}
            Company : ${notify.job.creator.Client.name}
            Status : ${notify.state.name}
            Comment By ${notify.job.creator.Client.name} : ${notify.state.comment}`
              .replace(/ {2,}/g, ' ')
          )
          .set('applicant_id', notify.applicant.id)
          .set('job_id', notify.job.id)
          .set('status', 1)
          .set('state_id', notify.state.id)
          .set('redirect', `/Applicants/view/${notify.applicant.id}`)
          .set('updated_by', notify.job.creator.id)
          .save();
      },
    },
  });

  return Notification;
};
