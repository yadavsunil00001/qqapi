'use strict';

module.exports = function FollowerTypeModel(sequelize, DataTypes) {
  const FollowerType = sequelize.define('FollowerType', {
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
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

  },
    {
      tableName: 'follower_types',
      timestamps: false,
      underscored: true,
      classMethods: {
        associate: function associate(models) {
          FollowerType.hasMany(models.Follower);
        },
      },
    });

  return FollowerType;
};
