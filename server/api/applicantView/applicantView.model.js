'use strict';

module.exports = function ApplicantViewModel(sequelize, DataTypes) {
  const ApplicantView = sequelize.define('ApplicantView', {
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
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'applicant_views',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        ApplicantView.belongsTo(models.Applicant, {
          foreignKey: 'applicant_id',
        });

        ApplicantView.belongsTo(models.User, {
          foreignKey: 'user_id',
        });
      },
    },
  });

  return ApplicantView;
};
