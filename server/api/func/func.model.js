

module.exports = function FuncModel(sequelize, DataTypes) {
  const Func = sequelize.define('Func', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: DataTypes.TEXT,
    eq_id: {
      type: DataTypes.INTEGER(4),
      validate: {
        isInt: {
          msg: 'eq_id field should be an integer',
        },
        len: {
          args: [0, 4],
          msg: 'Maximum length for eq_id field is 4',
        },
      },
      allowNull: false,
      defaultValue: 1,
    },
    system_defined: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'system_defined field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for system_defined field is 11',
        },
      },
      defaultValue: 0,
    },
  }, {
    tableName: 'funcs',
    timestamps: false,
    underscored: true,

    classMethods: {
      getFunctionList(db) {
        return db.Func.findAll({
          where: {
            system_defined: 1,
          },
          attributes: ['id', 'name'],
          order: '"name" ASC',
        });
      },
      associate(models) {
        Func.hasMany(models.Job);
        Func.hasMany(models.ClientPreferredFunction);
      },
    },
  });

  return Func;
};
