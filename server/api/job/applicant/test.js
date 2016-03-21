/**
 * Created by Manjesh on 07-03-2016.
 */



import _ from 'lodash';
import path from 'path';
import db,{PhoneNumber, Email, Education, JobApplication, ApplicantState, Experience,User,Job,JobAllocation, Solr,
  ConsultantResponse,Response,Client,JobScore,JobStatus, Applicant,sequelizeQuarc,Sequelize,Resume} from '../../../sqldb';
import config from './../../../config/environment';
import formidable from 'formidable';
import fsp from 'fs-promise';
import mkdirp from 'mkdirp-then';
import url from 'url';

function handleError(res,statusCode,err){
  statusCode = statusCode || 500;
  console.log("ERROR:",err)
  res.json(err);
}


function ListAllotedJobs(req,res) {

  var applicants = {
    user_id: 112,
    job_id:300,

    "fileUpload": {
      name:"You_Too_Can_Run_Neon_Run.pdf",
      path:"C:/home/gloryque/QDMS/Welcome/0/2193/You_Too_Can_Run_Neon_Run.pdf",
    },

    "name": "Manjesh V",
    "email_id": "manjeshpv@gmail.comx",
    "number": "98447172023",
    "expected_ctc": "3",
    "salary": "3",
    "notice_period": "3",
    "total_exp_m": "3",
    "total_exp": 3.03,
    "total_exp_y": "3",
    "degree_id": 10763,
    "region_id": 3,
    "employer_id": 1941,
    "designation_id": 5,

  }


  Applicant.build(_.pick(applicants,['name','expected_ctc','salary','notice_period','total_exp',]),{
    include: [ PhoneNumber, Email, Education, JobApplication, ApplicantState, Experience]
  })
    .set('created_by', applicants.user_id)
    .set('updated_by', applicants.user_id)
    .set('Emails',{email:applicants.email_id})
    .set('Education',{ degree_id: applicants.degree_id, institute_id: 1 })
    .set('PhoneNumbers',{ number: applicants.number })
    .set('ApplicantStates',{ state_id: 27,   user_id:applicants.user_id })
    .set('JobApplications',{ job_id:applicants.job_id })
    .set('Experiences',{ region_id : applicants.region_id, employer_id:applicants.employer_id, designation_id: applicants.designation_id })
    .save()
  .then(function(applicant){
    console.log('applicants.id',applicant.id)
    const applicantIdLowerRoundOff = (applicant.id - (applicant.id % 10000)).toString();
    console.log("applicantIdLowerRoundOff",applicantIdLowerRoundOff)
    let absoluteFolderPathToSave = path.join(config.QDMS_PATH, "Applicants", applicantIdLowerRoundOff, applicant.id.toString() )+ "/";
    console.log("x absoluteFolderPathToSave",absoluteFolderPathToSave)

    let fileName = applicants.fileUpload.name;
    console.log("1",applicants.fileUpload.path)
    const resumePromise =  fsp.readFile(applicants.fileUpload.path).then(function (fileStream) {
      return mkdirp(absoluteFolderPathToSave).then(function () {
        let fileExtension = fileName.split(".").pop(); // Extension
        let allowedExtType = ['doc', 'docx', 'pdf', 'rtf', 'txt'];
        if (allowedExtType.indexOf(fileExtension) === -1) {
          return Promise.reject({code: 500, desc: "File Type Not Allowed"});
        }
        console.log('2',applicants.fileUpload.path)
        let absoluteFilePath = absoluteFolderPathToSave + applicant.id + "." + fileExtension;
        return fsp.writeFile(absoluteFilePath, fileStream).then(function () {
          return Resume.create({
            applicant_id: applicant.id,
            contents: 'Please wait the file is under processing',
            path: path.join('Applicants/',applicantIdLowerRoundOff, applicant.id.toString() ,[applicant.id,fileExtension].join("."))
          });
        });
      });
    });

    return Promise.all([
      applicant.update({applicant_state_id: applicant.ApplicantStates[0].id}),
      resumePromise
    ]).then(function(promiseReturns){

      const applicant = promiseReturns[0];
      // Async: Not returned
      applicant.updateSolr(db,req.user.id,applicants.job_id).then(re =>{
        console.log("applicant indexed",re)
      }).catch(err => {
        console.log("solr index failed",err)
      })
    })
  }).catch(err => handleError(res,500,err))




}

var req= {user:{
  id : 112,
  client_id : 173,
  group_id : 2
}};
var res = {};
res.json = function(stream){
  console.log(stream)
}

ListAllotedJobs(req,res)



