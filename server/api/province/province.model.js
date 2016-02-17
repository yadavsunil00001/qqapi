'use strict';

module.exports = function ProvinceModel(sequelize, DataTypes) {
  const Province = sequelize.define('Province', {
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
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'provinces',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        Province.hasMany(models.Region);
      },
    },
  });

  return Province;
};
