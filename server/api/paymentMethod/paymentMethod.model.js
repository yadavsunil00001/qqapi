'use strict';

module.exports = function PaymentMethodModel(sequelize, DataTypes) {
  const PaymentMethod = sequelize.define('PaymentMethod', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    method_name: {
      type: DataTypes.STRING(50),
      validate: {
        len: {
          args: [0, 50],
          msg: 'Maximum length for method_name field is 50',
        },
      },
    },
    method_desc: {
      type: DataTypes.STRING(255),
      validate: {
        len: {
          args: [0, 255],
          msg: 'Maximum length for method_desc field is 255',
        },
      },
    },
  }, {
    tableName: 'payment_methods',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        PaymentMethod.hasMany(models.Client);
      },
    },
  });

  return PaymentMethod;
};
