'use strict';

export default function (sequelize, DataTypes) {
  var ClientPaymentMap = sequelize.define('ClientPaymentMap', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    client_id:  DataTypes.INTEGER(11),
    type:  DataTypes.INTEGER(11),
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
  }, {
    tableName: 'client_payment_maps',
    timestamps: false,
    underscored: true,
    classMethods: {
      associate: function associate(models) {
        ClientPaymentMap.belongsTo(models.Client, {
          foreignKey: 'client_id',
        });
        ClientPaymentMap.hasMany(models.Agreement);
      },
    },
  });

  return ClientPaymentMap;
}
