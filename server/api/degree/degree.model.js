

module.exports = function DegreeModel(sequelize, DataTypes) {
  const Degree = sequelize.define('Degree', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    degree: {
      type: DataTypes.STRING(128),
      validate: {
        len: {
          args: [0, 128],
          msg: 'Maximum length for degree field is 128',
        },
      },
      allowNull: false,
    },
    verified: {
      type: DataTypes.INTEGER(1),
      validate: {
        isInt: {
          msg: 'verified field should be an integer',
        },
        len: {
          args: [0, 1],
          msg: 'Maximum length for verified field is 1',
        },
      },
      allowNull: false,
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
    tableName: 'degrees',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {
        Degree.hasMany(models.Education, {
          defaultScope: {
            where: { status: 1 },
          },
        });

        Degree.hasMany(models.JobsDegree);
      },
    },
  });

  return Degree;
};
