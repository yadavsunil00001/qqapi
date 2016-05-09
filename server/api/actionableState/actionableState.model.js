
export default function (sequelize, DataTypes) {
  const ActionableState = sequelize.define('ActionableState', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    group_id: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'group_id field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for group_id field is 11',
        },
      },
    },
    child_id: {
      type: DataTypes.INTEGER(11),
      validate: {
        isInt: {
          msg: 'child_id field should be an integer',
        },
        len: {
          args: [0, 11],
          msg: 'Maximum length for child_id field is 11',
        },
      },
    },
  }, {
    tableName: 'actionable_states',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate(models) {
        ActionableState.belongsTo(models.State, {
          foreignKey: 'state_id',
        });
      },
      getChild(models, authUser) {
        const groupId = authUser.group_id;
        return models.ActionableState.findAll({
          attributes: ['state_id', 'child_id'],
          where: {
            group_id: groupId,
          },
          raw: true,
        }).then(states => {
          const ret = {};
          states.forEach(asx => {
            const parent = asx.state_id;
            const child = asx.child_id;
            if (!ret[parent]) {
              ret[parent] = [];
            } else {
              ret[parent] = '';
            }
            ret[parent].push(child);
          });
          return ret;
        });
      },
    },
  });

  return ActionableState;
}
