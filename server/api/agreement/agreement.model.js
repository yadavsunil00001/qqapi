
export default function (sequelize, DataTypes) {
  const Agreement = sequelize.define('Agreement', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    info: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
  }, {
    tableName: 'agreements',
    timestamps: false,
    underscored: true,
    classMethods: {
      associate(models) {
        Agreement.belongsTo(models.ClientPaymentMap, {
          foreignKey: 'client_payment_map_id',
        });
      },

    },
  });

  return Agreement;
}
