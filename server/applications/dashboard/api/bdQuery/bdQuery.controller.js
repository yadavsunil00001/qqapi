/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/login              ->  index
 * POST    /api/login              ->  create
 * GET     /api/login/:id          ->  show
 * PUT     /api/login/:id          ->  update
 * DELETE  /api/login/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import config from '../../config/environment';
import db ,{bdQuery} from '../../../../sqldb';
import querystring from 'querystring';

export function index(req,res){
    var exept = ['id'];

    var whereParams = _.clone(req.query)

    exept.forEach(item => {
      delete whereParams[item]
    })
    var whereOptions = querystring.stringify(whereParams)
    var whereString = whereOptions.split("&").join(" AND ")

    if(whereString != "")
      whereString = "WHERE  " +whereString


    if(req.query.id){
      bdQuery.findById(req.query.id).then(re =>{
        var querySQL = re.query + (whereString ? " " +whereString: "")
        db.sequelizeQuarc.query(querySQL, {type: db.Sequelize.QueryTypes.SELECT}).then(resultSet =>{
          return res.json(resultSet)
        })
      })
    } else {
      return res.status(400).json({message:"id missing"})
    }
}
