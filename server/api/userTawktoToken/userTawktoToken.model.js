

export default function (sequelize, DataTypes) {
  const UserTawktoToken = sequelize.define('UserTawktoToken', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    token_type: DataTypes.STRING(100),
    access_token: DataTypes.STRING(200),

  }, {
    tableName: 'user_tawkto_tokens',
    timestamps: false,
    underscored: true,


    classMethods: {
      associate(models) {
        UserTawktoToken.belongsTo(models.User, {
          foreignKey: 'user_id',
        });
      },
    },
  });

  return UserTawktoToken;
}
