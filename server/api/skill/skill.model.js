

module.exports = function SkillModel(sequelize, DataTypes) {
  const Skill = sequelize.define('Skill', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      validate: {
        len: {
          args: [0, 255],
          msg: 'Maximum length for name field is 255',
        },
      },
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
      allowNull: false,
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
    source: {
      type: DataTypes.STRING(45),
      validate: {
        len: {
          args: [0, 45],
          msg: 'Maximum length for source field is 45',
        },
      },
      defaultValue: 'Predefined',
    },
  }, {
    tableName: 'skills',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {
        Skill.hasMany(models.JobSkill);
      },
    },
  });

  return Skill;
};
