

module.exports = function ResumeModel(sequelize, DataTypes) {
  const Resume = sequelize.define('Resume', {
    id: {
      type: DataTypes.INTEGER(14),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    contents: DataTypes.TEXT('medium'),
    path: {
      type: DataTypes.STRING(255),
      validate: {
        len: {
          args: [0, 255],
          msg: 'Maximum length for path field is 255',
        },
      },
    },
    concat: {
      type: DataTypes.INTEGER(1),
      validate: {
        isInt: {
          msg: 'concat field should be an integer',
        },
        len: {
          args: [0, 1],
          msg: 'Maximum length for concat field is 1',
        },
      },
      allowNull: false,
      defaultValue: 0,
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
    tableName: 'resumes',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {
        Resume.belongsTo(models.Applicant, {
          foreignKey: 'applicant_id',
        });
      },
    },
  });

  return Resume;
};
