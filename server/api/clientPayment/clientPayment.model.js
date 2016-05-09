
import moment from 'moment';
import _ from 'lodash';

export default function (sequelize, DataTypes) {
  const ClientPayment = sequelize.define('ClientPayment', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    isFixed: DataTypes.INTEGER,
    currency: DataTypes.CHAR(3),
    payment_days: DataTypes.INTEGER,
    replacement_days: DataTypes.INTEGER,
    start_range: DataTypes.DOUBLE,
    end_range: DataTypes.DOUBLE,
    percent: DataTypes.FLOAT,
    no_of_payment: DataTypes.INTEGER,
    range_order: DataTypes.INTEGER,
    created_on: DataTypes.DATE,
    created_by: DataTypes.STRING(45),
    updated_on: DataTypes.DATE,
    updated_by: DataTypes.STRING(45),
    start_time: DataTypes.DATEONLY,
    end_time: DataTypes.DATEONLY,
    consultant_comment: DataTypes.TEXT,
    internal_comment: DataTypes.TEXT,
  }, {
    tableName: 'client_payments',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate() {

      },
      retrieveJobPayment(models, jobdetails) {
        const quarc = 'gloryque_quarc';
        // var currentDate = moment().format('YYYY-MM-DD');
        // return Promise.resolve(jobdetails)
        return models.ClientPaymentMap.findAll({ where: {
          client_id: jobdetails.User.get('client_id'),
          start_time: { $lte: moment(jobdetails.created_on).format('YYYY-MM-DD') },
          end_time: { $gte: moment(jobdetails.created_on).format('YYYY-MM-DD') },
        } }).then(clientPaymentMap => {
          let sqlQuery;
          if (_.get(clientPaymentMap[0], 'type') === 1) {
            sqlQuery = `SELECT id, client_id, isFixed, currency, payment_days, replacement_days,
              designation as start_range, 'NA' AS end_range,percent,no_of_payment,range_order,
              consultant_comment,internal_comment FROM ${quarc}.client_payment_designations
              WHERE id = ${jobdetails.client_payment_designation_id}`;
          } else {
            if (!(jobdetails.min_sal === 0 && jobdetails.max_sal === 0)) {
              sqlQuery = `SELECT id,client_id, isFixed,currency,payment_days,replacement_days,
              start_range,end_range, percent,no_of_payment,range_order,consultant_comment,
              internal_comment
              FROM (SELECT id,client_id,isFixed,currency,payment_days,replacement_days,start_range,
              end_range, percent,no_of_payment,range_order,consultant_comment,internal_comment
              FROM ${quarc}.client_payments WHERE client_id = ${jobdetails.User.get('client_id')}
              AND start_time <= '${moment(jobdetails.created_on).format('YYYY-MM-DD')}'
              AND end_time >=  '${moment(jobdetails.created_on).format('YYYY-MM-DD')}'
              AND start_range <= ${jobdetails.min_sal} ORDER BY start_range DESC LIMIT 1) AS A
              UNION SELECT id,client_id,isFixed,currency,payment_days,replacement_days,start_range,
              end_range,percent, no_of_payment,range_order,consultant_comment,internal_comment
              FROM ${quarc}.client_payments
              WHERE client_id = ${jobdetails.User.get('client_id')} AND
              start_time <= '${moment(jobdetails.created_on).format('YYYY-MM-DD')}'
              AND end_time >=  '${moment(jobdetails.created_on).format('YYYY-MM-DD')}'
              AND start_range <= ${jobdetails.max_sal} AND start_range >= ${jobdetails.min_sal}`;
            } else {
              sqlQuery = `SELECT id,client_id,isFixed,currency,payment_days,replacement_days,
              start_range,end_range,percent,no_of_payment,range_order,consultant_comment,
              internal_comment
              FROM ${quarc}.client_payments
              WHERE client_id = ${jobdetails.User.get('client_id')}
              AND start_time <= '${moment(jobdetails.created_on).format('YYYY-MM-DD')}'
              AND end_time >=  '${moment(jobdetails.created_on).format('YYYY-MM-DD')}'`;
            }
          }
          return models.sequelizeQuarc
            .query(sqlQuery, { type: models.Sequelize.QueryTypes.SELECT });
        });
      },
    },
  });

  return ClientPayment;
}
