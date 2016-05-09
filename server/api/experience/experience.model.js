

module.exports = function ExperienceModel(sequelize, DataTypes) {
  const Experience = sequelize.define('Experience', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    start: DataTypes.DATEONLY,
    end: DataTypes.DATEONLY,
    salary: DataTypes.DECIMAL(6, 2),
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
    tableName: 'experiences',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {
        Experience.belongsTo(models.Applicant, {
          foreignKey: 'applicant_id',
        });

        Experience.belongsTo(models.Employer, {
          foreignKey: 'employer_id',
        });

        Experience.belongsTo(models.Designation, {
          foreignKey: 'designation_id',
        });

        Experience.belongsTo(models.Region, {
          foreignKey: 'region_id',
        });
      },
    },
  });

  return Experience;
};
