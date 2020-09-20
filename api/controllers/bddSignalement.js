const BddSignalement = require("../models").BddSignalement;
const Bdd = require("../models").Bdd;

//simple
exports.list = function(req, res) {
  if(req.query){
    BddSignalement.findAll({where : req.query}).then(rows => {
      res.json(rows)
    })
  }
  else {
    BddSignalement.findAll().then(rows => {
        res.json(rows)
      })
    }
};

exports.findById = function(req, res) {
    BddSignalement.findByPk(req.params.id).then(rows => {
        res.json(rows)
      })
 };   

 exports.findByBddId = function(req, res) {
  BddSignalement.findAll({
    where: {
      bdd_id: req.params.bddId
    }
  }).then( (result) => res.json(result) )
};   

 exports.update = function(req, res) {
    BddSignalement.update(req.body, {
        where: {
            id: req.params.id
        }
      }).then( (result) => res.json(result) )
 }; 