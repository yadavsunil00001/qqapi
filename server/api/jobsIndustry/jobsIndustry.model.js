

module.exports = function JobsIndustryModel(sequelize, DataTypes) {
  const JobsIndustry = sequelize.define('JobsIndustry', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'jobs_industries',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {
        JobsIndustry.belongsTo(models.Industry, {
          foreignKey: 'industry_id',
        });

        JobsIndustry.belongsTo(models.Job, {
          foreignKey: 'job_id',
        });
      },
    },
  });

  return JobsIndustry;
};
