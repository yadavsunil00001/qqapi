'use strict';

export default function(sequelize, DataTypes) {
  const Welcome = sequelize.define('Welcome', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    job_id: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    designation: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    employer: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    current_salary: DataTypes.DECIMAL(15, 2),
    expected_salary: DataTypes.DECIMAL(15, 2),
    total_exp: {
      type : DataTypes.INTEGER(60),
      allowNull: false
    },
    higest_qualification: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    notice_period: {
      type : DataTypes.INTEGER(65),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(65),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    path: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    elite: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    source: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    con_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    approval_status: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 1
    }
  }, {
    tableName: 'welcomes',
    timestamps: false,
    underscored: true,
  });
  return Welcome;
}
