'use strict';

module.exports = function EducationModel(sequelize, DataTypes) {
  const Education = sequelize.define('Education', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    start: DataTypes.DATE,
    end: DataTypes.DATE,
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
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'educations',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        Education.belongsTo(models.Applicant, {
          foreignKey: 'applicant_id',
        });

        Education.belongsTo(models.Degree, {
          foreignKey: 'degree_id',
        });

        Education.belongsTo(models.Institute, {
          foreignKey: 'institute_id',
        });

        Education.belongsTo(models.Region, {
          foreignKey: 'region_id',
        });
      },
    },
  });

  return Education;
};
