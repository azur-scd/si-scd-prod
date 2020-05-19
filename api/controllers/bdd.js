const Bdd = require("../models").Bdd;
const BddSignalement = require("../models").BddSignalement;

//simple
exports.list = function(req, res) {
  if(req.query){
    Bdd.findAll({where : req.query}).then(rows => {
      res.json(rows)
    })
  }
  else {
    Bdd.findAll().then(rows => {
        res.json(rows)
      })
    }
  };

exports.findById = function(req, res) {
    Bdd.findByPk(req.params.bddId).then(rows => {
        res.json(rows)
      })
 };  

 exports.create = function(req, res) {
    Bdd.create(req.body).then( (result) => res.json(result) )
 };  

 exports.update = function(req, res) {
    Bdd.update(req.body, {
        where: {
            id: req.params.bddId
        }
      }).then( (result) => res.json(result) )
 }; 

 exports.delete = function(req, res) {
    Bdd.destroy({
        where: {
          id: req.params.bddId
        }
      }).then( (result) => res.json(result) )
 };
