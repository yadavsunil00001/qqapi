

export default function (sequelize, DataTypes) {
  const ScreeningState = sequelize.define('ScreeningState', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: DataTypes.STRING,
  }, {
    tableName: 'screening_states',
    timestamps: false,
    underscored: true,
    classMethods: {
      associate(models) {
        ScreeningState.hasMany(models.ApplicantScreening);
      },
    },
  });

  return ScreeningState;
}
