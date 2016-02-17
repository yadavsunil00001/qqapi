'use strict';


const php = require('../../components/php-serialize');
module.exports = function QueuedTaskModel(sequelize, DataTypes) {
  const QueuedTask = sequelize.define('QueuedTask', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    jobType: {
      type: DataTypes.STRING(45),
      validate: {
        len: {
          args: [0, 45],
          msg: 'Maximum length for name field is 45',
        },
      },
      allowNull: false,
    },
    data: {
      type: DataTypes.TEXT('medium'),
    },
    group: {
      type: DataTypes.STRING(255),
    },
    reference: {
      type: DataTypes.STRING(255),
    },
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    notbefore: {
      type: DataTypes.DATE,
    },
    fetched: {
      type: DataTypes.DATE,
    },
    progress: {
      type: DataTypes.FLOAT(3, 2),
    },
    completed: {
      type: DataTypes.DATE,
    },
    failed: {
      type: DataTypes.INTEGER(3),
    },
    failure_message: {
      type: DataTypes.TEXT(),
    },
    workerkey: {
      type: DataTypes.STRING(45),
    },
  }, {
    tableName: 'queued_tasks',
    timestamps: false,
    underscored: true,
    classMethods: {
      sendEmail: function sendEmail(emailObj) {
        'use strict';
        const data = php.serialize({
          settings: {
            subject: emailObj.subject,
            to: emailObj.to,
            from: emailObj.from,
            domain: emailObj.domain,
          },
          vars: {
            content: emailObj.content,
          },
        });
        const task = {
          jobType: 'Email',
          group: 'email',
          data,
        };
        return this.create(task);
      },
    },
  });

  return QueuedTask;
};
