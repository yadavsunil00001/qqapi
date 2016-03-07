'use strict';

export default function(sequelize, DataTypes) {
  const JobAllocation = sequelize.define('JobAllocation', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    job_id: {
      type: DataTypes.INTEGER(14),
      allowNull: false,
    },
    user_id: {
      type : DataTypes.INTEGER(14),
      allowNull: false,
    },
    consultant_response_id: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'consultant_response_id field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for consultant_response_id field is 11',
        },
      },
    },
    created_on: DataTypes.DATE,
    created_by: {
      type: DataTypes.INTEGER(14),
      validate: {
        isInt: {
          msg: 'created_by field should be an integer',
        },
        len: {
          args: [0, 14],
          msg: 'Maximum length for created_by field is 14',
        },
      },
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
    updated_by: {
      type: DataTypes.INTEGER(14),
      validate: {
        isInt: {
          msg: 'updated_by field should be an integer',
        },
        len: {
          args: [0, 14],
          msg: 'Maximum length for updated_by field is 14',
        },
      },
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    sms_sent_flag: DataTypes.INTEGER(11),
  }, {
    tableName: 'job_allocations',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        JobAllocation.belongsTo(models.Job, {
          foreignKey: 'job_id',
          defaultScope: {
            where: { status: 1 },
          },
        });

        JobAllocation.belongsTo(models.User, {
          foreignKey: 'user_id',
        });

        JobAllocation.belongsTo(models.ConsultantResponse, {
          foreignKey: 'consultant_response_id',
        });

      },
    },
  });

  return JobAllocation;
};
