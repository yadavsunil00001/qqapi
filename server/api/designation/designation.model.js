

module.exports = function DesignationModel(sequelize, DataTypes) {
  const Designation = sequelize.define('Designation', {
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
  }, {
    tableName: 'designations',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {
        Designation.hasMany(models.Experience, {
          defaultScope: {
            where: { status: 1 },
          },
        });
      },
    },
  });

  return Designation;
};
