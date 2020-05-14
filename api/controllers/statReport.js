const StatReport = require("../models").StatReport;

//simple
exports.list = function(req, res) {
  if(req.query){
    StatReport.findAll({where : req.query}).then(rows => {
      res.json(rows)
    })
  }
  else {
    StatReport.findAll().then(rows => {
        res.json(rows)
      })
    }
  };

exports.findById = function(req, res) {
  StatReport.findByPk(req.params.statReportId).then(rows => {
        res.json(rows)
      })
 };  

 exports.create = function(req, res) {
  StatReport.create(req.body).then( (result) => res.json(result) )
 };  

 exports.update = function(req, res) {
  StatReport.update(req.body, {
        where: {
            id: req.params.statReportId
        }
      }).then( (result) => res.json(result) )
 }; 

 exports.delete = function(req, res) {
  StatReport.destroy({
        where: {
          id: req.params.statReportId
        }
      }).then( (result) => res.json(result) )
 };