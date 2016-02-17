'use strict';

module.exports = function EndpointModel(sequelize, DataTypes) {
  const Endpoint = sequelize.define('Endpoint', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    http_method: {
      type: DataTypes.STRING(10),
      validate: {
        len: {
          args: [0, 10],
          msg: 'Maximum length for http_method field is 10',
        },
      },
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      validate: {
        len: {
          args: [0, 2047],
          msg: 'Maximum length for url field is 2047',
        },
      },
      allowNull: false,
    },
  }, {
    tableName: 'endpoints',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        Endpoint.belongsToMany(models.Scope, {
          through: {
            model: models.ItemScope,
            unique: false,
            scope: {
              scopable: 'access_token',
            },
          },
          foreignKey: 'scopable_id',
          constraints: false,
        });
      },
    },
  });

  return Endpoint;
};
