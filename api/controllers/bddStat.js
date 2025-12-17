// Fichier CRUD complet + fonctions analytiques avancées pour le modèle BddStat.
// Les fonctions indicators et esgbu utilisent des jointures avec Bdd et BddGestion pour enrichir les stats avec des données financières et de gestion.
// formForStat permet un filtrage dynamique sur année, BDD et report.
// uniqueReportByBddId fournit les reports disponibles par BDD, pour éviter les doublons.
// Structure très similaire à tes autres fichiers CRUD, mais avec des traitements supplémentaires pour les rapports et synthèses.


/*
       +------------+
       |  StatReport|
       +------------+
            ^
            | 1
            |
            | *
       +------------+
       |  BddStat   |
       +------------+
       | id         |
       | bdd_id     |
       | stats_reports_id
       | count      |
       | dimension  |
       | periodeDebut
       +------------+
            ^
            | *
            |
            | 1
       +------------+
       |    Bdd     |
       +------------+
       | id         |
       | bdd        |
       | type       |
       | perimetre  |
       | stats_counter
       | calcul_esgbu
       +------------+
            ^
            | 1
            |
            | *
       +------------+
       | BddGestion |
       +------------+
       | id         |
       | bdd_id     |
       | annee      |
       | montant_ttc|
       | etat       |
       +------------+

BddStat → Bdd : Chaque enregistrement de statistiques (BddStat) appartient à une base (Bdd).
BddStat → StatReport : Chaque statistique correspond à un type de report (stats_reports_id).
Bdd → BddGestion : Une BDD peut avoir plusieurs lignes de gestion (BddGestion) qui contiennent des informations financières (montant, état, année).

Comment les fonctions utilisent ces relations :
- formForStat : filtre BddStat par BDD + report + année et joint les infos BDD.
- indicators : joint BddStat → Bdd → BddGestion pour créer des indicateurs financiers.
- esgbu : similaire à indicators mais sans BddGestion (double join).
- uniqueReportByBddId : récupère les reports distincts pour une BDD via la relation BddStat → StatReport

*/

// Import des modèles utilisés
const BddStat = require("../models").BddStat;
const Bdd = require("../models").Bdd;
const BddGestion = require("../models").BddGestion;
const StatReport = require("../models").StatReport;
const Op = require('sequelize').Op; // opérateurs Sequelize pour conditions avancées

// ===========================
// Liste tous les enregistrements BddStat ou filtre selon req.query
// ===========================
exports.list = function(req, res) {
  if(req.query){
    // filtrage selon les paramètres de requête
    BddStat.findAll({where : req.query}).then(rows => {
      res.json(rows)
    })
  }
  else {
    // retourne tous les enregistrements
    BddStat.findAll().then(rows => {
        res.json(rows)
    })
  }
};

// ===========================
// Récupérer un enregistrement par son ID
// ===========================
exports.findById = function(req, res) {
  BddStat.findByPk(req.params.id).then(rows => {
        res.json(rows)
  })
};   

// ===========================
// Récupérer les stats d'une BDD spécifique
// ===========================
exports.findByBddId = function(req, res) {
  BddStat.findAll({
    where: { bdd_id: req.params.bddId }
  }).then((result) => res.json(result))
}

// ===========================
// Mettre à jour un enregistrement BddStat
// ===========================
exports.update = function(req, res) {
  BddStat.update(req.body, {
        where: { id: req.params.id }
  }).then((result) => res.json(result))
}; 

// ===========================
// Créer un nouvel enregistrement BddStat
// ===========================
exports.create = function(req, res) {
  BddStat.create(req.body).then((result) => res.json(result))
}; 

// ===========================
// Supprimer un enregistrement BddStat
// ===========================
exports.delete = function(req, res) {
  BddStat.destroy({
      where: { id: req.params.id }
  }).then((result) => res.json(result))
};

// ===========================
// Récupérer un formulaire filtré pour les stats d'une BDD et d'un report
// ===========================
exports.formForStat = function(req, res) {
  console.log(req.query)
  BddStat.findAll({
    attributes: ['id', 'bdd_id','stats_reports_id','periodeDebut','count','dimension'],
    where:{
      [Op.and]: [
        {stats_reports_id: req.query.reportId}, 
        {bdd_id: req.query.bddId}, 
        {periodeDebut: {[Op.startsWith]: req.query.year}}
      ]
    },
    include: [{
      model: Bdd,
      attributes: ['id', 'bdd', 'pref_stats_reports_id','perimetre'],
    }]
  }).then(rows => {
    // Construction d'un objet simplifié pour l'affichage
    const resObj = rows.map(row => {
      return {
        "id":row.id,
        "bdd_id":row.bdd_id,
        "bdd":row.Bdd.bdd,
        "pref_stats_reports_id":row.Bdd.pref_stats_reports_id,
        "perimetre":row.Bdd.perimetre,
        "stats_reports_id":row.stats_reports_id,
        "periodeDebut":row.periodeDebut,
        "count":row.count,
        "dimension":row.dimension
      }
    });
    res.json(resObj)
  })
};

// ===========================
// Récupère les reports uniques disponibles pour une BDD
// ===========================
exports.uniqueReportByBddId = function(req, res) {
  BddStat.findAll({
    where: { bdd_id: req.params.bddId },
    distinct: ['stats_reports_id'], // distinct sur stats_reports_id
    attributes : ['stats_reports_id'],
    group : ['stats_reports_id'],   // groupement pour éviter doublons
    include: [{model: StatReport, attributes: ['mesure']}],
  }).then(rows => { res.json(rows) })
}

// ===========================
// Récupère les indicateurs (triple join BddStat → Bdd → BddGestion)
// ===========================
exports.indicators = function(req, res) {
  if(Object.keys(req.query).length === 0) { 
    // Sans paramètre de requête : récupère toutes les stats totales non refus d’accès
    BddStat.findAll({
      attributes: ['id', 'bdd_id', 'stats_reports_id','count','periodeDebut'],
      where:{
        dimension : "total",
        stats_reports_id: { [Op.not]: 3 }
      },
      include: [{
        model: Bdd,
        attributes: ['id', 'bdd', 'type','soutien_oa','pole_gestion','perimetre','stats_counter','calcul_esgbu'],
        include: [{
          model: BddGestion,
          attributes: ['annee','montant_ttc'],
          where: { etat:"4-facture" }
        }]
      }]   
    }).then(rows => {
      const resObj = rows.map(d => {
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
            .filter(dbis => dbis.annee == d.periodeDebut.substring(0, 4))
            .map(dter => { obj["montant"]=dter.montant_ttc })
          }
        }
        return obj
      })
      res.json(resObj)
    })
  }
  else {
    // Avec filtres passés dans req.query
    req.query["dimension"]="total"
    include_gestion_conditions = {etat:"4-facture"}
    if(req.query["year"]) {
      req.query["periodeDebut"] =  {[Op.startsWith]: req.query.year}
      delete req.query['year'];
    }
    if(req.query["stats_reports_id"] && req.query["stats_reports_id"].includes(",")) {
      req.query["stats_reports_id"] = {[Op.or]:req.query.stats_reports_id.split(",").map(d=>d)}
    }
    console.log(req.query)
    BddStat.findAll({
      attributes: ['id', 'bdd_id', 'stats_reports_id','count','periodeDebut'],
      where:req.query,
      include: [{
        model: Bdd,
        attributes: ['id', 'bdd', 'type','soutien_oa','pole_gestion','perimetre','stats_counter','calcul_esgbu'],
        include: [{ model: BddGestion, attributes: ['annee','montant_ttc'] }]
      }]   
    }).then(rows => {
      const resObj = rows.map(d => {
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
            .filter(dbis => dbis.annee == d.periodeDebut.substring(0, 4))
            .map(dter => { obj["montant"]=dter.montant_ttc })
          }
        }
        return obj
      })
      res.json(resObj)
    })
  }
}

// ===========================
// Synthèse ESGBU (double join BddStat → Bdd)
// ===========================
exports.esgbu = function(req, res) {
  if(Object.keys(req.query).length === 0) {
    // Sans filtre : récupère toutes les stats totales non refus
    BddStat.findAll({
      attributes: ['id', 'bdd_id', 'stats_reports_id','count','periodeDebut'],
      where:{ dimension : "total", stats_reports_id: { [Op.not]: 3 } },
      include: [{
        model: Bdd,
        attributes: ['id', 'bdd', 'type','soutien_oa','pole_gestion','perimetre','stats_counter','calcul_esgbu']
      }]   
    }).then(rows => {
      const resObj = rows.map(d => {
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
    // Avec filtres
    req.query["dimension"]="total"
    if(req.query["year"]) {
      req.query["periodeDebut"] =  {[Op.startsWith]: req.query.year}
      delete req.query['year'];
    }
    if(req.query["stats_reports_id"] && req.query["stats_reports_id"].includes(",")) {
      req.query["stats_reports_id"] = {[Op.or]:req.query.stats_reports_id.split(",").map(d=>d)}
    }
    console.log(req.query)
    BddStat.findAll({
      attributes: ['id', 'bdd_id', 'stats_reports_id','count','periodeDebut'],
      where:req.query,
      include: [{
        model: Bdd,
        attributes: ['id', 'bdd', 'type','soutien_oa','pole_gestion','perimetre','stats_counter','calcul_esgbu']
      }]   
    }).then(rows => {
      const resObj = rows.map(d => {
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
