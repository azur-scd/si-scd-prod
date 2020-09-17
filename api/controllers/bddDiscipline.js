const BddDiscipline = require("../models").BddDiscipline;

//simple
exports.list = function(req, res) {
    if(req.query){
        BddDiscipline.findAll({where : req.query}).then(rows => {
        res.json(rows)
      })
    }
    else {
        BddDiscipline.findAll().then(rows => {
          res.json(rows)
        })
      }
  };
  
  exports.findById = function(req, res) {
    BddDiscipline.findByPk(req.params.id).then(rows => {
          res.json(rows)
        })
   };   
  
    exports.findByDiscId = function(req, res) {
    BddDiscipline.findAll({
      where: {
        disc_id: req.params.discId
      }
    }).then( (result) => res.json(result) )
  }; 
  
  exports.findByBddId = function(req, res) {
    BddDiscipline.findAll({
      where: {
        bdd_id: req.params.bddId
      }
    }).then( (result) => res.json(result) )
  };

  exports.update = function(req, res) {
    BddDiscipline.update(req.body, {
        where: {
            id: req.params.id
        }
      }).then( (result) => res.json(result) )
 }; 

 exports.create = function(req, res) {
    BddDiscipline.create(req.body).then( (result) => res.json(result) )
}; 

exports.delete = function(req, res) {
    BddDiscipline.destroy({
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
};