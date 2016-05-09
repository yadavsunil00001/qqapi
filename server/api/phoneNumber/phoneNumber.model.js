

module.exports = function PhoneNumberModel(sequelize, DataTypes) {
  const PhoneNumber = sequelize.define('PhoneNumber', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    number: {
      type: DataTypes.INTEGER(20),
      validate: {
        len: {
          args: [0, 20],
          msg: 'Maximum length for number field is 20',
        },
      },
    },
    status: {
      type: DataTypes.INTEGER(1),
      validate: {
        isInt: {
          msg: 'status field should be an integer',
        },
        len: {
          args: [0, 1],
          msg: 'Maximum length for status field is 1',
        },
      },
      defaultValue: 1,
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'phone_numbers',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {
        PhoneNumber.belongsTo(models.Applicant, {
          foreignKey: 'applicant_id',
        });
      },
    },
  });

  return PhoneNumber;
};
