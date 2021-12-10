const Gc = require("../models").Gc;

//simple
exports.list = function(req, res) {
  if(req.query){
    Gc.findAll({where : req.query}).then(rows => {
      res.json(rows)
    })
  }
  else {
    Gc.findAll().then(rows => {
        res.json(rows)
      })
    }
  };

exports.findById = function(req, res) {
    Gc.findByPk(req.params.gcId).then(rows => {
        res.json(rows)
      })
 };
 
 exports.findByBddId = function(req, res) {
  Gc.findAll({
    where: {
      bdd_id: req.params.bddId
    }
  }).then( (result) => res.json(result) )
};

 exports.create = function(req, res) {
    Gc.create(req.body).then( (result) => res.json(result) )
 };  

 exports.update = function(req, res) {
    Gc.update(req.body, {
        where: {
            id: req.params.gcId
        }
      }).then( (result) => res.json(result) )
 }; 

 exports.delete = function(req, res) {
    Gc.destroy({
        where: {
          id: req.params.gcId
        }
      }).then( (result) => res.json(result) )
 };