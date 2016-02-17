'use strict';

module.exports = function GroupModel(sequelize, DataTypes) {
  const Group = sequelize.define('Group', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(32),
      validate: {
        len: {
          args: [0, 32],
          msg: 'Maximum length for name field is 32',
        },
      },
      allowNull: false,
    },
  }, {
    tableName: 'groups',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        Group.belongsToMany(models.Scope, {
          through: {
            model: models.ItemScope,
            unique: false,
            scope: {
              scopable: 'group',
            },
          },
          foreignKey: 'scopable_id',
          constraints: false,
        });

        Group.hasMany(models.Client);
        Group.hasMany(models.Follower);
      },
    },
  });

  return Group;
};
