

module.exports = function ClientPreferredFunctionModel(sequelize, DataTypes) {
  const ClientPreferredFunction = sequelize.define('ClientPreferredFunction', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'client_preferred_functions',
    timestamps: false,
    underscored: true,

    classMethods: {
      getClientPreferredFunctionList(db, clientId) {
        return db.ClientPreferredFunction.findAll({
          where: {
            client_id: clientId,
          },
          attributes: ['id', 'func_id'],
        });
      },
      associate(models) {
        ClientPreferredFunction.belongsTo(models.Func, {
          foreignKey: 'func_id',
        });

        ClientPreferredFunction.belongsTo(models.Client, {
          foreignKey: 'client_id',
        });
      },
    },
  });

  return ClientPreferredFunction;
};
