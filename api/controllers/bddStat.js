const BddStat = require("../models").BddStat;
//const Bdd = require("../models").Bdd;
const Op = require('sequelize').Op;

//simple
exports.list = function(req, res) {
  if(req.query){
    BddStat.findAll({where : req.query}).then(rows => {
      res.json(rows)
    })
 
  }
  else {
    BddStat.findAll().then(rows => {
        res.json(rows)
      })
    }
};

exports.findById = function(req, res) {
  BddStat.findByPk(req.params.id).then(rows => {
        res.json(rows)
      })
 };   

 exports.findByBddId = function(req, res) {
    BddStat.findAll({
      where: {
        bdd_id: req.params.bddId
      }
    })

 /* if(req.query.annee){
  BddStat.findAll({
    where: {
        bdd_id: req.params.bddId,
        periodeDebut:{[Op.startsWith]: req.query.annee},
        type_stats_reports_id: req.query.report
    }
  }).then( (result) => res.json(result) )
 }
 else if(req.query.dimension){
  BddStat.findAll({
    where: {
        bdd_id: req.params.bddId,
        dimension: req.query.dimension,
        type_stats_reports_id: req.query.report
    },
    order: [
      [SUBSTRING_INDEX(periodeDebut, '-', 1), 'DESC']
  ]

  }).then( (result) => res.json(result) )
 }
 else{
  BddStat.findAll({
    where: {
      bdd_id: req.params.bddId
    }
  }).then( (result) => res.json(result) )
 }*/


 /* BddStat.findAll({
    where: {
      bdd_id: req.params.bddId
    }
  }).then( (result) => res.json(result) )*/

};  
/*[Op.eq]: 2
 exports.findByGroup = function(req, res) {
    BddMetadataSignalement.findAll({
        include: [{
            model: Bdd,
            where: { id_bu:Sequelize.col('Bdd.id') }
        }]
    }).then(rows => {
        res.json(rows)
      })
 };*/

 exports.update = function(req, res) {
  BddStat.update(req.body, {
        where: {
            id: req.params.id
        }
      }).then( (result) => res.json(result) )
 }; 

 exports.create = function(req, res) {
  BddStat.create(req.body).then( (result) => res.json(result) )
}; 

exports.delete = function(req, res) {
  BddStat.destroy({
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
};
