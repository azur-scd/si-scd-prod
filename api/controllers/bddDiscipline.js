const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const BddDiscipline = require("../models").BddDiscipline;
const Bdd = require("../models").Bdd;
const Disc = require("../models").Disc;
const BddGestion = require("../models").BddGestion;

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
  
  
  exports.findDiscWithBddCost = function(req, res) {
    BddDiscipline.findAll({
     /* where: {
        disc_id: req.params.discId
      }
      ,*/ include: [{
        model: Bdd,
        attributes: ['bdd'],
    },
        {
        model: Disc,
        attributes: ['disc','parent_id'],
    },
    {
      model: BddGestion,
      attributes: ['etat','montant_ttc'],
      where: {
        annee: req.params.year
      },
      on: {
        [Op.and]: [
            Sequelize.where(
                Sequelize.col('BddDiscipline.bdd_id'),
                Op.eq, // '=',
                Sequelize.col('BddGestion.bdd_id')
            )
        ],
    }
  }],    
    })
    //.then( (result) => res.json(result) )
    .then(rows => {
      const resObj = rows.map(row => {return {
                                              "id":row.id,
                                              "disc_id":row.disc_id,
                                              "disc":row.Disc.disc,
                                              "parent_id":row.Disc.parent_id,
                                              "bdd_id":row.bdd_id,
                                              "bdd":row.Bdd.bdd,
                                              "quotite":row.quotite,
                                              "montant_part": row.BddGestion.montant_ttc * row.quotite / 100,
                                              "etat":row.BddGestion.etat,
                                              "montant_ttc":row.BddGestion.montant_ttc}});
      res.json(resObj)
    })
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