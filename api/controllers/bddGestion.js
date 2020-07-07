const BddGestion = require("../models").BddGestion;
const Bdd = require("../models").Bdd;

//simple
exports.list = function(req, res) {
  if(req.query){
    BddGestion.findAll({where : req.query}).then(rows => {
      res.json(rows)
    })
  }
  else {
    BddGestion.findAll().then(rows => {
        res.json(rows)
      })
    }
};

exports.findById = function(req, res) {
    BddGestion.findByPk(req.params.id).then(rows => {
        res.json(rows)
      })
 };   

 exports.findByBddId = function(req, res) {
  BddGestion.findAll({
    where: {
      bdd_id: req.params.bddId
    }
  }).then( (result) => res.json(result) )
};  
 /*exports.findByGroup = function(req, res) {
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
    BddGestion.update(req.body, {
        where: {
            id: req.params.id
        }
      }).then( (result) => res.json(result) )
 }; 

 exports.create = function(req, res) {
  BddGestion.create(req.body).then( (result) => res.json(result) )
}; 

exports.delete = function(req, res) {
  BddGestion.destroy({
      where: {
        id: req.params.id
      }
    }).then( (result) => res.json(result) )
};

 //join pour gestion
exports.listForGestion = function(req, res) {
  var q;
  if(req.query) {q = {where : req.query, include: [{
    model: Bdd,
    attributes: ['id', 'bdd', 'pole_gestion','perimetre','soutien_oa'],
    where: {
    gestion: 1
  }
}]}}
else {q={include: [{
  model: Bdd,
  attributes: ['id', 'bdd', 'pole_gestion','perimetre','soutien_oa'],
  where: {
  gestion: 1
}
}]}}
    BddGestion.findAll(
      q
    ).then(rows => {
      //res.json(rows)
      const resObj = rows.map(row => {return {
                                              "id":row.id,
                                              "bdd_id":row.bdd_id,
                                              "bdd":row.Bdd.bdd,
                                              "pole":row.Bdd.pole_gestion,
                                              "perimetre":row.Bdd.perimetre,
                                              "soutien_oa":row.Bdd.soutien_oa,
                                              "etat":row.etat,
                                              "annee":row.annee,
                                              "montant_initial":row.montant_initial,
                                              "devise":row.devise,
                                              "taux_change":row.taux_change,
                                              "montant_ht":row.montant_ht,
                                              "part_tva1":row.part_tva1,
                                              "taux_tva1":row.taux_tva1,
                                              "part_tva2":row.part_tva2,
                                              "taux_tva2":row.taux_tva2,
                                              "taux_recup_tva":row.taux_recup_tva,
                                              "taux_tva_frais_gestion":row.taux_tva_frais_gestion,
                                              "montant_frais_gestion":row.montant_frais_gestion,
                                              "montant_ttc":row.montant_ttc,
                                              "last_estime":row.last_estime,
                                              "reliquat": row.reliquat,
                                              "surcout_uca": row.surcout_uca,
                                              "commentaire":row.commentaire,
                                              "createdAt":row.createdAt,
                                              "updatedAt":row.updatedAt}});
      res.json(resObj)
    })
  };
