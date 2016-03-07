'use strict';

export default function(sequelize, DataTypes) {
  const Response = sequelize.define('Response', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: DataTypes.STRING,
  },{
    tableName: 'responses',
    timestamps: false,
    underscored: true,
    classMethods: {
      associate: function associate(models) {

      },
    },
  });

  return Response;
}
