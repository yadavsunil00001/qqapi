'use strict';

module.exports = function ItemScopeModel(sequelize, DataTypes) {
  const ItemScope = sequelize.define('ItemScope', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    scope_id: {
      type: DataTypes.INTEGER,
      unique: 'item_scope_scopable',
    },
    scopable: {
      type: DataTypes.STRING,
      unique: 'item_scope_scopable',
    },
    scopable_id: {
      type: DataTypes.INTEGER,
      unique: 'item_scope_scopable',
      references: null,
    },
  }, {
    tableName: 'item_scopes',
    timestamps: false,
    underscored: true,
  });

  return ItemScope;
};
