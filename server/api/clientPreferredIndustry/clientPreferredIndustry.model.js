'use strict';

module.exports = function ClientPreferredIndustryModel(sequelize, DataTypes) {
  const ClientPreferredIndustry = sequelize.define('ClientPreferredIndustry', {
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
    tableName: 'client_preferred_industries',
    timestamps: false,
    underscored: true,

    classMethods: {
      getClientPreferredIndustryList : function getClientPreferredIndustryList(db, client_id){
        return db.ClientPreferredIndustry.findAll({
          where: {
            client_id: client_id
          },
          attributes: ['id','industry_id'],
        })
      },
      associate: function associate(models) {
        ClientPreferredIndustry.belongsTo(models.Industry, {
          foreignKey: 'industry_id',
        });

        ClientPreferredIndustry.belongsTo(models.Client, {
          foreignKey: 'client_id',
        });
      },
    },
  });

  return ClientPreferredIndustry;
};
