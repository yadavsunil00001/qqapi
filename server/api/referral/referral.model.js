'use strict';

module.exports = function ReferralModel(sequelize, DataTypes) {
  const Referral = sequelize.define('Referral', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      validate: {
        len: {
          args: [0, 100],
          msg: 'Maximum length for name field is 100',
        },
      },
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(45),
      validate: {
        len: {
          args: [0, 45],
          msg: 'Maximum length for email field is 45',
        },
      },
      allowNull: false,
    },
    country_code: {
      type: DataTypes.STRING(3),
      validate: {
        len: {
          args: [0, 3],
          msg: 'Maximum length for country_code field is 3',
        },
      },
      defaultValue: 91,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      validate: {
        len: {
          args: [0, 15],
          msg: 'Maximum length for phone_number field is 15',
        },
      },
      allowNull: false,
    },
    has_contacted: {
      type: DataTypes.INTEGER(1),
      validate: {
        isInt: {
          msg: 'has_contacted field should be an integer',
        },
        len: {
          args: [0, 1],
          msg: 'Maximum length for has_contacted field is 1',
        },
      },
      defaultValue: 0,
    },
    is_interested: {
      type: DataTypes.INTEGER(1),
      validate: {
        isInt: {
          msg: 'is_interested field should be an integer',
        },
        len: {
          args: [0, 1],
          msg: 'Maximum length for is_interested field is 1',
        },
      },
      defaultValue: 0,
    },
  }, {
    tableName: 'referrals',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        Referral.belongsTo(models.Applicant, {
          foreignKey: 'applicant_id',
        });

        Referral.belongsTo(models.Job, {
          foreignKey: 'job_id',
        });
      },
    },
  });

  return Referral;
};
