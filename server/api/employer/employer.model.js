'use strict';

module.exports = function EmployerModel(sequelize, DataTypes) {
  const Employer = sequelize.define('Employer', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(300),
      validate: {
        len: {
          args: [0, 300],
          msg: 'Maximum length for name field is 300',
        },
      },
      allowNull: false,
    },
    is_customer: {
      type: DataTypes.INTEGER(1),
      validate: {
        isInt: {
          msg: 'is_customer field should be an integer',
        },
        len: {
          args: [0, 1],
          msg: 'Maximum length for is_customer field should be 1',
        },
      },
      allowNull: false,
      defaultValue: 0,
    },
    employer_type_id: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'employer_type_id field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for employer_type_id field should be 11',
        },
      },
    },
    verified: {
      type: DataTypes.INTEGER(1),
      validate: {
        isInt: {
          msg: 'verified field should be an integer',
        },
        len: {
          args: [0, 1],
          msg: 'Maximum length for verified field should be 1',
        },
      },
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    system_defined: {
      type: DataTypes.INTEGER(1),
      validate: {
        isInt: {
          msg: 'system_defined field should be an integer',
        },
        len: {
          args: [0, 1],
          msg: 'Maximum length for system_defined field is 1',
        },
      },
      defaultValue: 1,
    },
  }, {
    tableName: 'employers',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        Employer.hasMany(models.Experience, {
          defaultScope: {
            where: { status: 1 },
          },
        });

        Employer.hasMany(models.JobsEmployer);
      },
    },
  });

  return Employer;
};
