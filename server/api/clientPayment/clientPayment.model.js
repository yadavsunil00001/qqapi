'use strict';

export default function(sequelize, DataTypes) {
  const ClientPayment = sequelize.define('ClientPayment', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    isFixed: DataTypes.INTEGER,
  },{
    tableName: 'client_payments',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {

      },
    },
  });

  return ClientPayment;
}
