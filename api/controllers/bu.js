const Bu = require("../models").Bu;

exports.list = function(req, res) {
  if(req.query){
    Bu.findAll({where : req.query}).then(rows => {
      res.json(rows)
    })
  }
  else {
    Bu.findAll().then(rows => {
        res.json(rows)
      })
    }
  };

exports.findById = function(req, res) {
    Bu.findByPk(req.params.buId).then(rows => {
        res.json(rows)
      })
 };  

 exports.create = function(req, res) {
    Bu.create(req.body).then( (result) => res.json(result) )
 };  

 exports.update = function(req, res) {
    Bu.update(req.body, {
        where: {
            id: req.params.buId
        }
      }).then( (result) => res.json(result) )
 }; 

 exports.delete = function(req, res) {
    Bu.destroy({
        where: {
          id: req.params.buId
        }
      }).then( (result) => res.json(result) )
 };
/*module.exports = {
    list(res,req){
      return Bu.findAll().then(rows => {
        res.json(rows)
      })
   
    }
}*/