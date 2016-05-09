

module.exports = function RegionModel(sequelizeQuantum, DataTypes) {
  const Region = sequelizeQuantum.define('Region', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    region: {
      type: DataTypes.STRING(64),
      validate: {
        len: {
          args: [0, 64],
          msg: 'Maximum length for region field is 64',
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
      defaultValue: 0,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'regions',
    timestamps: false,
    underscored: true,
    getterMethods: {
      name() {
        return this.getDataValue('region');
      },
    },

    classMethods: {
      associate(models) {
        Region.hasMany(models.Education);
        Region.hasMany(models.Experience);
        Region.hasMany(models.Job);

        Region.belongsTo(models.Province, {
          foreignKey: 'province_id',
        });
      },
    },
  });

  return Region;
};
