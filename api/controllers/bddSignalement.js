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
    BddSignalement.update(req.body, {
        where: {
            id: req.params.id
        }
      }).then( (result) => res.json(result) )
 }; 

 exports.listForSignalement = function(req, res) {
    BddSignalement.findAll({
      include: [{
        model: Bdd,
        attributes: ['id', 'bdd'],
        where: {
        signalement: 1
      }
    }]
    }).then(rows => {
      //res.json(rows)
      const resObj = rows.map(row => {return {"id":row.id,
                                              "bdd_id":row.bdd_id,
                                              //"bdd":row.Bdd.bdd,
                                              "nom_court":row.nom_court,
                                              "source":row.source,
                                              "url":row.url,
                                              "proxified_url":row.proxified_url,
                                              "editeur":row.editeur,
                                              "disc":row.disc,
                                              "langue":row.langue,
                                              "type_contenu":row.type_contenu,
                                              "type_acces":row.type_acces,
                                              "note_acces":row.note_acces,
                                              "type_base":row.type_base,
                                              "description":row.description,
                                              "tuto":row.tuto,
                                              "icone":row.icone,
                                              "alltitles":row.alltitles,
                                              "uca":row.uca,
                                              "commentaire":row.commentaire,
                                              "createdAt":row.createdAt,
                                              "updatedAt":row.updatedAt}});
      res.json(resObj)
    })
  }; 
  
