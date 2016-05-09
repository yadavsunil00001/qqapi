'use strict';

export default function (sequelize, DataTypes) {
  const ConsultantResponse = sequelize.define('ConsultantResponse', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    job_id: DataTypes.STRING,
    user_id: DataTypes.STRING,
    response_id: DataTypes.STRING,
    timestamp: DataTypes.BOOLEAN,
  }, {
    tableName: 'consultant_responses',
    timestamps: false,
    underscored: true,
    classMethods: {
      associate: function associate(models) {
        // ConsultantResponse.belongsTo(models.User, {
        //  foreignKey: 'consultant_response_id',
        // });

        // ConsultantResponse.belongsTo(models.Response, {
        //  foreignKey: 'response_id',
        // });

        ConsultantResponse.belongsTo(models.Job, {
          foreignKey: 'job_id',
        });

        ConsultantResponse.belongsTo(models.User, {
          foreignKey: 'user_id',
        });

        ConsultantResponse.belongsTo(models.Response, {
          foreignKey: 'response_id',
        });
        // ConsultantResponse.hasOne(models.User);
      },
    },
  });
  return ConsultantResponse;
}

