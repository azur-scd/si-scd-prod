const Bdd = require("../models").Bdd;
const BddSignalement = require("../models").BddSignalement;

//simple
exports.list = function(req, res) {
  if(req.query){
    Bdd.findAll({where : req.query}).then(rows => {
      res.json(rows)
    })
  }
  else {
    Bdd.findAll().then(rows => {
        res.json(rows)
      })
    }
  };

exports.findById = function(req, res) {
    Bdd.findByPk(req.params.bddId).then(rows => {
        res.json(rows)
      })
 };  

 exports.create = function(req, res) {
    Bdd.create(req.body).then( (result) => res.json(result) )
 };  

 exports.update = function(req, res) {
    Bdd.update(req.body, {
        where: {
            id: req.params.bddId
        }
      }).then( (result) => res.json(result) )
 }; 

 exports.delete = function(req, res) {
    Bdd.destroy({
        where: {
          id: req.params.bddId
        }
      }).then( (result) => res.json(result) )
 };
 //join pour signalement example
 /*exports.listForSignalement = function(req, res) {
  Bdd.findAll({
    attributes: ['id', 'bdd'],
    where: {
      signalement: 1
    },
    include: [{
      model: BddSignalement
  }]
  }).then(rows => {
    const resObj = rows.map(row => {return {"bdd":row.bdd,
                                            "id":row.BddSignalement.id,
                                            "bdd_id":row.id,
                                            "nom_court":row.BddSignalement.nom_court,
                                            "source":row.BddSignalement.source,
                                            "proxified_url":row.BddSignalement.proxified_url,
                                            "editeur":row.BddSignalement.editeur,
                                            "disc":row.BddSignalement.disc,
                                            "langue":row.BddSignalement.langue,
                                            "type_contenu":row.BddSignalement.type_contenu,
                                            "type_acces":row.BddSignalement.type_acces,
                                            "note_acces":row.BddSignalement.note_acces,
                                            "type_base":row.BddSignalement.type_base,
                                            "description":row.BddSignalement.description,
                                            "tuto":row.BddSignalement.tuto,
                                            "icone":row.BddSignalement.icone,
                                            "alltitles":row.BddSignalement.alltitles,
                                            "commentaire":row.BddSignalement.commentaire,
                                            "createdAt":row.BddSignalement.createdAt,
                                            "updatedAt":row.BddSignalement.updatedAt}});
    res.json(resObj)
  })
}; */
