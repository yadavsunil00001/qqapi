'use strict';

module.exports = function LogoModel(sequelize, DataTypes) {
  const Logo = sequelize.define('Logo', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    logo: {
      type: DataTypes.BLOB('long'),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(64),
      validate: {
        len: {
          args: [0, 64],
          msg: 'Maximum length for name field is 64',
        },
      },
      allowNull: false,
    },
    mime: {
      type: DataTypes.STRING(64),
      validate: {
        len: {
          args: [0, 64],
          msg: 'Maximum length for mime field is 64',
        },
      },
      allowNull: false,
    },
  }, {
    tableName: 'logos',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        Logo.hasMany(models.Client);
      },
    },
  });

  return Logo;
};
