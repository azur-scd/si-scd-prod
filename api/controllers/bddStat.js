const BddStat = require("../models").BddStat;
const Bdd = require("../models").Bdd;
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
  }).then( (result) => res.json(result) )
  }

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

 //join pour stats
 exports.listForStat = function(req, res) {
   console.log(req.query)
  BddStat.findAll({
    where:{
      [Op.and]: [{stats_reports_id: req.query.reportId}, {bdd_id: req.query.bddId}, { periodeDebut: {[Op.startsWith]: req.query.year}}]
    },
    include: [{
      model: Bdd,
      attributes: ['id', 'bdd', 'pref_stats_reports_id','perimetre'],
      where: {
      gestion: 1
    }
  }]
  }).then(rows => {
    //res.json(rows)
    const resObj = rows.map(row => {return {
                                            "id":row.id,
                                            "bdd_id":row.bdd_id,
                                            //"bdd":row.Bdd.bdd,
                                            "pref_stats_reports_id":row.Bdd.pref_stats_reports_id,
                                            "perimetre":row.Bdd.perimetre,
                                            "stats_reports_id":row.stats_reports_id,
                                            "periodeDebut":row.periodeDebut,
                                            "periodeFin":row.periodeFin,
                                            "count":row.count,
                                            "dimension":row.dimension,
                                            "mesure":row.mesure,
                                            "commentaire":row.commentaire,
                                            "createdAt":row.createdAt,
                                            "updatedAt":row.updatedAt}});
    res.json(resObj)
  })
};
