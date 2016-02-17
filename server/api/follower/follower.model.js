'use strict';

module.exports = function FollowerModel(sequelize, DataTypes) {
  const Follower = sequelize.define('Follower', {
      id: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      project_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      sharedby_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER(14),
        validate: {
          isInt: {
            msg: 'created_by field should be an integer',
          },
          len: {
            args: [0, 14],
            msg: 'Maximum length for created_by field is 14',
          },
        },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('NOW'),
      },
      updated_by: {
        type: DataTypes.INTEGER(14),
        validate: {
          isInt: {
            msg: 'updated_by field should be an integer',
          },
          len: {
            args: [0, 14],
            msg: 'Maximum length for updated_by field is 14',
          },
        },
      },
      updated_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn('NOW'),
      },
    },
    {
      tableName: 'followers',
      timestamps: false,
      underscored: false,
      defaultScope: {
        where: {
          active: 1,
        },
      },

      classMethods: {
        associate: function associate(models) {
          Follower.belongsTo(models.User, {
            schema: 'gloryque_quantum',
            foreignKey: 'user_id',
          });

          Follower.belongsTo(models.Applicant, {
            foreignKey: 'applicant_id',
          });

          Follower.belongsTo(models.Job, {
            foreignKey: 'job_id',
          });

          Follower.belongsTo(models.Client, {
            foreignKey: 'client_id',
          });

          Follower.belongsTo(models.FollowerAccess, {
            foreignKey: 'follower_access_id',
          });

          Follower.belongsTo(models.Group, {
            foreignKey: 'group_id',
          });

          Follower.belongsTo(models.FollowerType, {
            foreignKey: 'follower_type_id',
          });
        },
      },
    });

  return Follower;
};
