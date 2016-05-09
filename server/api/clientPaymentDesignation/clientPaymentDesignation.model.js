'use strict';

export default function (sequelize, DataTypes) {
  var ClientPaymentDesignation = sequelize.define('ClientPaymentDesignation', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    isFixed:DataTypes.INTEGER,
    currency:DataTypes.CHAR(3),
    payment_days:DataTypes.INTEGER,
    replacement_days:DataTypes.INTEGER,
    designation: DataTypes.STRING(500),
    percent:DataTypes.FLOAT,
    no_of_payment:DataTypes.INTEGER,
    range_order:DataTypes.INTEGER,
    created_on:DataTypes.DATE,
    created_by:DataTypes.STRING(45),
    updated_on: DataTypes.DATE,
    updated_by:DataTypes.STRING(45),
    start_time:DataTypes.DATEONLY,
    end_time:DataTypes.DATEONLY,
    consultant_comment:DataTypes.TEXT(),
    internal_comment:DataTypes.TEXT(),
  }, {
    tableName:'client_payment_designations',
    timestamps: false,
    underscored: true,
    classMethods: {
      associate: function associate(models) {
        // ClientPaymentDesignation.belongsTo(models.Client, {
        //  foreignKey: 'client_id',
        // });

        // ClientPaymentDesignation.hasMany(models.Job);
      },
    },
  });

  return ClientPaymentDesignation;
}
