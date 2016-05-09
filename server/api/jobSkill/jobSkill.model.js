

module.exports = function JobSkillModel(sequelize, DataTypes) {
  const JobSkill = sequelize.define('JobSkill', {
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
      defaultValue: 1,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    verified: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'verified field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for verified field is 11',
        },
      },
    },
    skill_count: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'skill_count field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for skill_count field is 11',
        },
      },
      defaultValue: 1,
      allowNull: false,
    },
    manual: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'manual field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for manual field is 11',
        },
      },
      defaultValue: 0,
      allowNull: false,
    },
    isRequired: {
      type: DataTypes.INTEGER(1),
      validate: {
        isInt: {
          msg: 'isRequired field should be an integer',
        },
        len: {
          args: [0, 1],
          msg: 'Maximum length for isRequired field is 1',
        },
      },
      allowNull: false,
      defaultValue: 1,
    },
    job_id: {
      type: DataTypes.INTEGER(14),
      validate: {
        isInt: {
          msg: 'job_id field should be an integer',
        },
        len: {
          args: [0, 14],
          msg: 'Maximum length for job_id field is 14',
        },
      },
    },
    parser_added: {
      type: DataTypes.INTEGER(1),
      validate: {
        isInt: {
          msg: 'parser_added field should be an integer',
        },
        len: {
          args: [0, 1],
          msg: 'Maximum length for parser_added field is 1',
        },
      },
      defaultValue: 0,
    },
  }, {
    tableName: 'job_skills',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {
        JobSkill.belongsTo(models.Job, {
          foreignKey: 'job_id',
        });

        JobSkill.belongsTo(models.Skill, {
          foreignKey: 'skill_id',
        });
      },
    },
  });

  return JobSkill;
};
