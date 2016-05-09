
module.exports = function ApplicantSkillModel(sequelize, DataTypes) {
  const ApplicantSkill = sequelize.define('ApplicantSkill', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    skill_count: {
      type: DataTypes.INTEGER(14),
      validate: {
        isInt: {
          msg: 'skill_count field should be an integer',
        },
        len: {
          args: [0, 14],
          msg: 'Maximum length for skill_count field is 14',
        },
      },
    },
    verified: {
      type: DataTypes.INTEGER(14),
      validate: {
        isInt: {
          msg: 'verified field should be an integer',
        },
        len: {
          args: [0, 14],
          msg: 'Maximum length for verified field is 14',
        },
      },
    },
    manual: {
      type: DataTypes.INTEGER(14),
      validate: {
        isInt: {
          msg: 'manual field should be an integer',
        },
        len: {
          args: [0, 14],
          msg: 'Maximum length for manual field is 14',
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
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'applicant_skills',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {
        ApplicantSkill.belongsTo(models.Applicant, {
          foreignKey: 'applicant_id',
        });

        ApplicantSkill.belongsTo(models.Skill, {
          foreignKey: 'skill_id',
        });
      },
    },
  });

  return ApplicantSkill;
};
