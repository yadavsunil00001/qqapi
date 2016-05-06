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

  var existingApplicants = {
    user_id: 112,
    job_id:300,

    "fileUpload": {
      name:"You_Too_Can_Run_Neon_Run.pdf",
      path:"C:/home/gloryque/QDMS/Welcome/0/2193/You_Too_Can_Run_Neon_Run.pdf",
    },

    "name": "Manjeshfghfgh V", // main model

    "email_id": "manjeshpvghgh@gmail.comx", // emails
    "number": "98447372023", // phone number
    "expected_ctc": "13", // main

    "notice_period": "4",

    "total_exp": 4.03,


    "degree_id": 10763, // education

    "salary": "4",
    "region_id": 4, // exp
    "employer_id": 1341,
    "designation_id": 6,

  }

  req.body = existingApplicants

  db.Applicant.getFullDetails(db,req.params.existingApplicantId).then(existingApplicant => {
    var applicantToUpdate = req.body



    console.log(path.extname(applicantToUpdate.fileUpload.path));

    //var promises = [
    //  db.Applicant.findById(existingApplicant.id).then(appl => appl.update(_.pick(applicantToUpdate,'name','expected_ctc','notice_period','total_exp')))
    //]
    //
    //if(_.get(existingApplicant.Emails[0],'email') !== req.body.email_id ){
    //  promises.push(db.Email.findById(_.get(existingApplicant.Emails[0],'id')).then(email => email.update({email:req.body.email_id})))
    //}
    //if(_.get(existingApplicant.PhoneNumbers[0],'number') !== req.body.number ){
    //  promises.push(db.PhoneNumber.findById(_.get(existingApplicant.PhoneNumbers[0],'id')).then(number => number.update({number:req.body.number})))
    //}
    ////console.log(existingApplicant.Education)
    //if(_.get(existingApplicant.Education[0],'id') !== applicantToUpdate.degree_id ){
    //  promises.push(db.Education.findById(_.get(existingApplicant.Education[0],'id')).then(education => education.update({degree_id:applicantToUpdate.degree_id})))
    //}
    //
    //if(_.get(existingApplicant.Experience[0],'salary') !== req.body.salary || _.get(existingApplicant.Experience[0],'region_id') !== req.body.region_id ||
    //  _.get(existingApplicant.Experience[0],'employer_id') !== req.body.employer_id){
    //
    //  promises.push(db.Experience.findById(_.get(existingApplicant.Experience,'id'))
    //    .then(exp => exp.update({
    //      salary:req.body.salary, region_id:req.body.region_id, employer_id:req.body.employer_id, designation_id: req.body.designation_id
    //    })))
    //}
    //
    //
    //
    //Promise.all(promises).then(prRe => {
    //  console.log("done")
    //})
  }).catch(err => handleError(res,500,err))


  //Applicant.build(_.pick(existingApplicants,['name','expected_ctc','salary','notice_period','total_exp',]),{
  //  include: [ PhoneNumber, Email, Education, JobApplication, ApplicantState, Experience]
  //})
  //  .set('created_by', existingApplicants.user_id)
  //  .set('updated_by', existingApplicants.user_id)
  //  .set('Emails',{email:existingApplicants.email_id})
  //  .set('Education',{ degree_id: existingApplicants.degree_id, institute_id: 1 })
  //  .set('PhoneNumbers',{ number: existingApplicants.number })
  //  .set('ApplicantStates',{ state_id: 27,   user_id:existingApplicants.user_id })
  //  .set('JobApplications',{ job_id:existingApplicants.job_id })
  //  .set('Experiences',{ region_id : existingApplicants.region_id, employer_id:existingApplicants.employer_id, designation_id: existingApplicants.designation_id })
  //  .save()
  //.then(function(existingApplicant){
  //  console.log('existingApplicants.id',existingApplicant.id)
  //  const existingApplicantIdLowerRoundOff = (existingApplicant.id - (existingApplicant.id % 10000)).toString();
  //  console.log("existingApplicantIdLowerRoundOff",existingApplicantIdLowerRoundOff)
  //  let absoluteFolderPathToSave = path.join(config.QDMS_PATH, "Applicants", existingApplicantIdLowerRoundOff, existingApplicant.id.toString() )+ "/";
  //  console.log("x absoluteFolderPathToSave",absoluteFolderPathToSave)
  //
  //  let fileName = existingApplicants.fileUpload.name;
  //  console.log("1",existingApplicants.fileUpload.path)
  //  const resumePromise =  fsp.readFile(existingApplicants.fileUpload.path).then(function (fileStream) {
  //    return mkdirp(absoluteFolderPathToSave).then(function () {
  //      let fileExtension = fileName.split(".").pop(); // Extension
  //      let allowedExtType = ['doc', 'docx', 'pdf', 'rtf', 'txt'];
  //      if (allowedExtType.indexOf(fileExtension) === -1) {
  //        return Promise.reject({code: 500, desc: "File Type Not Allowed"});
  //      }
  //      console.log('2',existingApplicants.fileUpload.path)
  //      let absoluteFilePath = absoluteFolderPathToSave + existingApplicant.id + "." + fileExtension;
  //      return fsp.writeFile(absoluteFilePath, fileStream).then(function () {
  //        return Resume.create({
  //          existingApplicant_id: existingApplicant.id,
  //          contents: 'Please wait the file is under processing',
  //          path: path.join('Applicants/',existingApplicantIdLowerRoundOff, existingApplicant.id.toString() ,[existingApplicant.id,fileExtension].join("."))
  //        });
  //      });
  //    });
  //  });
  //
  //  return Promise.all([
  //    existingApplicant.update({existingApplicant_state_id: existingApplicant.ApplicantStates[0].id}),
  //    resumePromise
  //  ]).then(function(promiseReturns){
  //
  //    const existingApplicant = promiseReturns[0];
  //    // Async: Not returned
  //    existingApplicant.updateSolr(db,req.user.id,existingApplicants.job_id).then(re =>{
  //      console.log("existingApplicant indexed",re)
  //    }).catch(err => {
  //      console.log("solr index failed",err)
  //    })
  //  })
  //}).catch(err => handleError(res,500,err))




}

var req= {params:{jobId:1548,existingApplicantId:55057},user:{
  id : 112,
  client_id : 173,
  group_id : 2
}};
var res = {};
res.json = function(stream){
  console.log(stream)
}

ListAllotedJobs(req,res)



