

module.exports = function FollowerAccessModel(sequelize, DataTypes) {
  const FollowerAccess = sequelize.define('FollowerAccess', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      validate: {
        len: {
          args: [0, 255],
          msg: 'Maximum length for name field is 255',
        },
      },
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

  },
    {
      tableName: 'follower_accesses',
      timestamps: false,
      underscored: true,
      classMethods: {
        associate(models) {
          FollowerAccess.hasMany(models.Follower);
        },
      },
    });

  return FollowerAccess;
};
