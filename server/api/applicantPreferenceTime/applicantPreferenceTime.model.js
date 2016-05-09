'use strict';

export default function (sequelize, DataTypes) {
  const ApplicantPreferenceTime = sequelize.define('ApplicantPreferenceTime', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    hash: DataTypes.STRING(100),
    time: DataTypes.STRING(50),
  }, {
    tableName: 'applicant_preference_times',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        ApplicantPreferenceTime.belongsTo(models.Applicant, {
          foreignKey: 'applicant_id',
        });
      },
    },
  });

  return ApplicantPreferenceTime;
}
