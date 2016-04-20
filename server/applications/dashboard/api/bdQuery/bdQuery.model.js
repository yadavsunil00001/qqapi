'use strict';

module.exports = function bdQueryModel(sequelize, DataTypes) {
  const bdQuery = sequelize.define('bdQuery', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    query: DataTypes.TEXT,
    description: DataTypes.INTEGER,
    target: DataTypes.DECIMAL
  }, {
    tableName: 'bd_queries',
    timestamps: false,
    underscored: true,
    classMethods: {
      associate: function associate(models) {

      },
    },
  });

  return bdQuery;
};
