

module.exports = function HotlineModel(sequelize, DataTypes) {
  const Hotline = sequelize.define('Hotline', {
    id: {
      type: DataTypes.INTEGER(3),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    numbers: {
      type: DataTypes.INTEGER(10),
      validate: {
        isInt: {
          msg: 'numbers field should be an integer',
        },
        len: {
          args: [0, 10],
          msg: 'Maximum length for numbers field is 10',
        },
      },
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(255),
      validate: {
        len: {
          args: [0, 255],
          msg: 'Maximum length for status field is 255',
        },
      },
      allowNull: false,
    },
  }, {
    tableName: 'hotlines',
    timestamps: false,
    underscored: true,
  });

  return Hotline;
};
