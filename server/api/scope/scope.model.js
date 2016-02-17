'use strict';

module.exports = function ScopeModel(sequelize, DataTypes) {
  const Scope = sequelize.define('Scope', {
    id: {
      type: DataTypes.INTEGER(14),
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
    description: {
      type: DataTypes.TEXT('medium'),
      validate: {
        len: {
          args: [0, 1024],
          msg: 'Maximum length for description field is 1024',
        },
      },
      allowNull: false,
    },
  }, {
    tableName: 'scopes',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        Scope.belongsToMany(models.AccessToken, {
          through: {
            model: models.ItemScope,
            unique: false,
          },
          foreignKey: 'scope_id',
        });

        Scope.belongsToMany(models.RefreshToken, {
          through: {
            model: models.ItemScope,
            unique: false,
          },
          foreignKey: 'scope_id',
        });

        Scope.belongsToMany(models.AuthCode, {
          through: {
            model: models.ItemScope,
            unique: false,
          },
          foreignKey: 'scope_id',
        });

        Scope.belongsToMany(models.Endpoint, {
          through: {
            model: models.ItemScope,
            unique: false,
          },
          foreignKey: 'scope_id',
        });

        Scope.belongsToMany(models.Group, {
          through: {
            model: models.ItemScope,
            unique: false,
          },
          foreignKey: 'scope_id',
        });

        Scope.belongsToMany(models.App, {
          through: {
            model: models.ItemScope,
            unique: false,
          },
          foreignKey: 'scope_id',
        });
      },
    },
  });

  return Scope;
};
