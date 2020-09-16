const Disc = require("../models").Disc;

//simple
exports.list = function(req, res) {
  if(req.query){
    Disc.findAll({where : req.query}).then(rows => {
      res.json(rows)
    })
  }
  else {
    Disc.findAll().then(rows => {
        res.json(rows)
      })
    }
  };

exports.findById = function(req, res) {
    Disc.findByPk(req.params.discId).then(rows => {
        res.json(rows)
      })
 };  

 exports.create = function(req, res) {
    Disc.create(req.body).then( (result) => res.json(result) )
 };  

 exports.update = function(req, res) {
    Disc.update(req.body, {
        where: {
            id: req.params.discId
        }
      }).then( (result) => res.json(result) )
 }; 

 exports.delete = function(req, res) {
    Disc.destroy({
        where: {
          id: req.params.discId
        }
      }).then( (result) => res.json(result) )
 };