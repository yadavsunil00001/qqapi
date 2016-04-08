'use strict';

export default function(sequelize, DataTypes) {
  const ApplicantScreening =  sequelize.define('ApplicantScreening', {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: DataTypes.STRING,
    comments: DataTypes.STRING,
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    consultant_email_sent: DataTypes.BOOLEAN,
    recruiter_email_sent: DataTypes.BOOLEAN,
  }, {
    tableName: 'applicant_screenings',
    timestamps: false,
    underscored: true,

    classMethods: {
      associate: function associate(models) {
        ApplicantScreening.belongsTo(models.Applicant, {
          foreignKey: 'applicant_id',
        });

        ApplicantScreening.belongsTo(models.ScreeningState, {
          foreignKey: 'screening_state_id',
        });

        ApplicantScreening.belongsTo(models.User, {
          foreignKey: 'user_id',
        });
      },
      legacyMap(models,states,loggedInUserId){
        // map is  a relation between stateId (as key) and screening state id (as value) which is required for mapping
        const map = {
          1: 3,
          13: 1,
          32: 5,
          6: 2,
          27: 4
        };

        var applicantScreenings = [];
        states.forEach(function(state){
          if(-1 === (Object.keys(map)).indexOf(state.state_id.toString())) {
            console.log("state.state_id",state.state_id)
            console.log("Object.keys(map)",Object.keys(map))
            console.log("(Object.keys(map)).indexOf(state.state_id))",(Object.keys(map)).indexOf(state.state_id))
            return
          }
          var applicantScreening = {};
          applicantScreening.screening_state_id = map[state.state_id];
          // Todo: Review for data.user_id remails undefined for all time
          applicantScreening.user_id = !applicantScreening.user_id ? loggedInUserId : applicantScreening.user_id; // copied logic from /app/Model/ApplicantScreening - 72:60
          applicantScreening.applicant_id = state.applicant_id;
          applicantScreening.comments = state.comments ? state.comments : '';
          applicantScreening.consultant_email_sent = 1;
          applicantScreening.recruiter_email_sent = 1;
          console.log("applicantScreening",applicantScreening)
          applicantScreenings.push(applicantScreening)
        })

        return models.ApplicantScreening.bulkCreate(applicantScreenings)
      }
    },
  });

  return ApplicantScreening;
}
