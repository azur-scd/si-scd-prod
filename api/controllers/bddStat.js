const BddStat = require("../models").BddStat;
const Bdd = require("../models").Bdd;
const BddGestion = require("../models").BddGestion;
const StatReport = require("../models").StatReport;
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

//formdata pour stats
 exports.formForStat = function(req, res) {
   console.log(req.query)
  BddStat.findAll({
	attributes: ['id', 'bdd_id','stats_reports_id','periodeDebut','count','dimension'],
    where:{
      [Op.and]: [{stats_reports_id: req.query.reportId}, {bdd_id: req.query.bddId}, { periodeDebut: {[Op.startsWith]: req.query.year}}]
    },
    include: [{
      model: Bdd,
      attributes: ['id', 'bdd', 'pref_stats_reports_id','perimetre'],
  }]
  }).then(rows => {
    //res.json(rows)
    const resObj = rows.map(row => {return {
                                            "id":row.id,
                                            "bdd_id":row.bdd_id,
                                            "bdd":row.Bdd.bdd,
                                            "pref_stats_reports_id":row.Bdd.pref_stats_reports_id,
                                            "perimetre":row.Bdd.perimetre,
                                            "stats_reports_id":row.stats_reports_id,
                                            "periodeDebut":row.periodeDebut,
                                            //"periodeFin":row.periodeFin,
                                            "count":row.count,
                                            "dimension":row.dimension,
                                            //"commentaire":row.commentaire,
                                            //"createdAt":row.createdAt,
                                            //"updatedAt":row.updatedAt
											}});
    res.json(resObj)
  })
};

//unique stat report available in bdd by database
exports.uniqueReportByBddId = function(req, res) {
  BddStat.findAll({
    where: {
      bdd_id: req.params.bddId
    },
    distinct: ['stats_reports_id'],
    attributes : ['stats_reports_id'],
    group : ['stats_reports_id'],
    include: [{model: StatReport, 
              attributes: ['mesure']}],
  })
  .then(rows => {
    res.json(rows)
  })
}

//triple join for indicators
exports.indicators = function(req, res) {
 if(Object.keys(req.query).length === 0) { //si pas de params de requête
  BddStat.findAll({
    attributes: ['id', 'bdd_id', 'stats_reports_id','count','periodeDebut'], // on récupère les lignes de stats dans la table
    where:{
      dimension : "total", // filtrées sur les totaux uniquement
      stats_reports_id: {
        [Op.not]: 3  //on ne veut pas les refus d'accès (inutile pour ratios cost per use)
      }
    },
    include: [{
      model: Bdd, // jointure table bdd
      attributes: ['id', 'bdd', 'type','soutien_oa','pole_gestion','perimetre','stats_counter','calcul_esgbu'],
      include: [{
        model: BddGestion,
        attributes: ['annee','montant_ttc'],
        where: {
          //bdd_id: req.query.bddId,
          etat:"4-facture"
        }
    }]
  }]   
  }).then(rows => {
    const resObj = rows.map(function(d) {
      var obj = {}
      obj["id"]=d.id
      obj["bdd_id"]=d.bdd_id
      obj["stats_reports_id"]=d.stats_reports_id
      obj["count"]=d.count
      obj["periodeDebut"]=d.periodeDebut
        if (d.Bdd) {
      obj["bdd"]=d.Bdd.bdd
      obj["type"]=d.Bdd.type
      obj["oa"]=d.Bdd.soutien_oa
      obj["achat"]=d.Bdd.type_achat
      obj["perimetre"]=d.Bdd.perimetre
	  obj["counter"]=d.Bdd.stats_counter
      obj["calcul_esgbu"]=d.Bdd.calcul_esgbu
      if(d.Bdd.BddGestions) {
      d.Bdd.BddGestions
      .filter(function(dbis) {
         return dbis.annee == d.periodeDebut.substring(0, 4)
      })
      .map(function(dter) {
        return obj["montant"]=dter.montant_ttc;
      })
    }
    }
      return obj
    })
    res.json(resObj)
  })
}
else {
  req.query["dimension"]="total"
  include_gestion_conditions = {etat:"4-facture"}
  if(req.query["year"]) {
    req.query["periodeDebut"] =  {[Op.startsWith]: req.query.year}
    //include_gestion_conditions["annee"] = req.query.year
    delete req.query['year'];
  }
  if(req.query["stats_reports_id"] && req.query["stats_reports_id"].includes(",")) {
    req.query["stats_reports_id"] = {[Op.or]:req.query.stats_reports_id.split(",").map(function(d){return d})}
  }
  console.log(req.query)
  BddStat.findAll({
    attributes: ['id', 'bdd_id', 'stats_reports_id','count','periodeDebut'],
    where:req.query
      //[Op.and]: [{stats_reports_id: req.query.reportId}, {bdd_id: req.query.bddId}, { periodeDebut: {[Op.startsWith]: req.query.year}}, {dimension : "total"}],
    ,
    include: [{
      model: Bdd,
      attributes: ['id', 'bdd', 'type','soutien_oa','pole_gestion','perimetre','stats_counter','calcul_esgbu'],
      include: [{
        model: BddGestion,
        attributes: ['annee','montant_ttc'],
        //where: include_gestion_conditions
    }]
  }]   
  }).then(rows => {
    const resObj = rows.map(function(d) {
      var obj = {}
      obj["id"]=d.id
      obj["bdd_id"]=d.bdd_id
      obj["stats_reports_id"]=d.stats_reports_id
      obj["count"]=d.count
      obj["periodeDebut"]=d.periodeDebut
      if(d.Bdd) {
      obj["bdd"]=d.Bdd.bdd
      obj["type"]=d.Bdd.type
      obj["oa"]=d.Bdd.soutien_oa
      obj["achat"]=d.Bdd.type_achat
      obj["perimetre"]=d.Bdd.perimetre
	  obj["counter"]=d.Bdd.stats_counter
      obj["calcul_esgbu"]=d.Bdd.calcul_esgbu
      if(d.Bdd.BddGestions) {
      d.Bdd.BddGestions
      .filter(function(dbis) {
         return dbis.annee == d.periodeDebut.substring(0, 4)
      })
      .map(function(dter) {
        return obj["montant"]=dter.montant_ttc;
      })
    }
    }
      return obj
    })
    res.json(resObj)
  })
}
}

//double join for esgbu stats synthese
exports.esgbu = function(req, res) {
  if(Object.keys(req.query).length === 0) { //si pas de params de requête
   BddStat.findAll({
     attributes: ['id', 'bdd_id', 'stats_reports_id','count','periodeDebut'], // on récupère les lignes de stats dans la table
     where:{
       dimension : "total", // filtrées sur les totaux uniquement
       stats_reports_id: {
         [Op.not]: 3  //on ne veut pas les refus d'accès (inutile pour ratios cost per use)
       }
     },
     include: [{
       model: Bdd, // jointure table bdd
       attributes: ['id', 'bdd', 'type','soutien_oa','pole_gestion','perimetre','stats_counter','calcul_esgbu'],
   }]   
   }).then(rows => {
     const resObj = rows.map(function(d) {
       var obj = {}
       obj["id"]=d.id
       obj["bdd_id"]=d.bdd_id
       obj["stats_reports_id"]=d.stats_reports_id
       obj["count"]=d.count
       obj["periodeDebut"]=d.periodeDebut
         if (d.Bdd){ 
           obj["bdd"]=d.Bdd.bdd
           obj["type"]=d.Bdd.type
           obj["oa"]=d.Bdd.soutien_oa
           obj["achat"]=d.Bdd.type_achat
           obj["perimetre"]=d.Bdd.perimetre
           obj["counter"]=d.Bdd.stats_counter
           obj["calcul_esgbu"]=d.Bdd.calcul_esgbu
     }
       return obj
     })
     res.json(resObj)
   })
 }
 else {
   req.query["dimension"]="total"
   include_gestion_conditions = {etat:"4-facture"}
   if(req.query["year"]) {
     req.query["periodeDebut"] =  {[Op.startsWith]: req.query.year}
     //include_gestion_conditions["annee"] = req.query.year
     delete req.query['year'];
   }
   if(req.query["stats_reports_id"] && req.query["stats_reports_id"].includes(",")) {
     req.query["stats_reports_id"] = {[Op.or]:req.query.stats_reports_id.split(",").map(function(d){return d})}
   }
   console.log(req.query)
   BddStat.findAll({
     attributes: ['id', 'bdd_id', 'stats_reports_id','count','periodeDebut'],
     where:req.query
       //[Op.and]: [{stats_reports_id: req.query.reportId}, {bdd_id: req.query.bddId}, { periodeDebut: {[Op.startsWith]: req.query.year}}, {dimension : "total"}],
     ,
     include: [{
       model: Bdd,
       attributes: ['id', 'bdd', 'type','soutien_oa','pole_gestion','perimetre','stats_counter','calcul_esgbu'],
   }]   
   }).then(rows => {
     const resObj = rows.map(function(d) {
       var obj = {}
       obj["id"]=d.id
       obj["bdd_id"]=d.bdd_id
       obj["stats_reports_id"]=d.stats_reports_id
       obj["count"]=d.count
       obj["periodeDebut"]=d.periodeDebut
       if(d.Bdd) {
       obj["bdd"]=d.Bdd.bdd
       obj["type"]=d.Bdd.type
       obj["oa"]=d.Bdd.soutien_oa
       obj["achat"]=d.Bdd.type_achat
       obj["perimetre"]=d.Bdd.perimetre
       obj["counter"]=d.Bdd.stats_counter
       obj["calcul_esgbu"]=d.Bdd.calcul_esgbu
     }
       return obj
     })
     res.json(resObj)
   })
 }
 } 
