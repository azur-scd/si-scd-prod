const StatSuivi = require("../models").StatSuivi;

//simple
exports.list = function(req, res) {
  if(req.query){
    StatSuivi.findAll({where : req.query}).then(rows => {
      res.json(rows)
    })
  }
  else {
    StatSuivi.findAll().then(rows => {
        res.json(rows)
      })
    }
  };

exports.findById = function(req, res) {
    StatSuivi.findByPk(req.params.id).then(rows => {
        res.json(rows)
      })
 };  

 exports.findByBddId = function(req, res) {
    StatSuivi.findAll({
      where: {
        bdd_id: req.params.bddId
      }
    }).then( (result) => res.json(result) )
  };

 exports.create = function(req, res) {
    StatSuivi.create(req.body).then( (result) => res.json(result) )
 };  

 exports.update = function(req, res) {
    StatSuivi.update(req.body, {
        where: {
            id: req.params.id
        }
      }).then( (result) => res.json(result) )
 }; 

 exports.delete = function(req, res) {
    StatSuivi.destroy({
        where: {
          id: req.params.id
        }
      }).then( (result) => res.json(result) )
 };