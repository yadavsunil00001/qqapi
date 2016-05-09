

module.exports = function JobsDegreeModel(sequelize, DataTypes) {
  const JobsDegree = sequelize.define('JobsDegree', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'jobs_degrees',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {
        JobsDegree.belongsTo(models.Job, {
          foreignKey: 'job_id',
        });

        JobsDegree.belongsTo(models.Degree, {
          foreignKey: 'degree_id',
        });
      },
    },
  });

  return JobsDegree;
};
