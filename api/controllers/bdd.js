// req.query : permet de filtrer les enregistrements depuis l’URL.
// req.params.bddId : permet de récupérer un paramètre dynamique de l’URL (ex: /bdd/5).
// req.body : contient les données envoyées par le client (POST ou PUT).
// Sequelize renvoie toujours des Promises, d’où l’utilisation de .then(...).
// BddSignalement est importé mais jamais utilisé dans ce code.
  
  // On importe le modèle "Bdd" depuis le dossier "../models". 
// Ce modèle correspond à une table dans la base de données.
const Bdd = require("../models").Bdd;

// On importe le modèle "BddSignalement" depuis le même dossier.
// Il n'est pas utilisé dans ce code, mais peut servir pour gérer les signalements.
const BddSignalement = require("../models").BddSignalement;

// Définition de la fonction "list" qui sera exposée (exportée) pour récupérer des enregistrements.
exports.list = function(req, res) {
  // On vérifie si la requête HTTP contient des paramètres de query (ex: /bdd?champ=valeur)
  if(req.query){
    // Si des paramètres sont présents, on filtre les résultats avec "where : req.query"
    Bdd.findAll({where : req.query}).then(rows => {
      // Une fois les résultats récupérés, on les renvoie en JSON au client
      res.json(rows)
    })
  }
  else {
    // Si aucun paramètre de filtre, on récupère tous les enregistrements de la table Bdd
    Bdd.findAll().then(rows => {
        res.json(rows)
      })
    }
  };

// Définition de la fonction "findById" pour récupérer un enregistrement spécifique via son ID
exports.findById = function(req, res) {
    // findByPk = find by primary key. On utilise l'ID passé dans l'URL (req.params.bddId)
    Bdd.findByPk(req.params.bddId).then(rows => {
        // On renvoie l'enregistrement trouvé en JSON
        res.json(rows)
      })
 };  

// Définition de la fonction "create" pour ajouter un nouvel enregistrement
exports.create = function(req, res) {
    // On crée un enregistrement avec les données envoyées dans le corps de la requête (req.body)
    Bdd.create(req.body).then( (result) => 
        // On renvoie l'objet créé en JSON
        res.json(result) 
    )
 };  

// Définition de la fonction "update" pour mettre à jour un enregistrement existant
exports.update = function(req, res) {
    // On met à jour l'enregistrement dont l'ID correspond à req.params.bddId
    Bdd.update(req.body, {
        where: {
            id: req.params.bddId
        }
      }).then( (result) => 
        // Sequelize renvoie un tableau avec le nombre de lignes affectées
        res.json(result) 
    )
 }; 

// Définition de la fonction "delete" pour supprimer un enregistrement
exports.delete = function(req, res) {
    // On supprime l'enregistrement dont l'ID correspond à req.params.bddId
    Bdd.destroy({
        where: {
          id: req.params.bddId
        }
      }).then( (result) => 
        // Sequelize renvoie le nombre de lignes supprimées
        res.json(result) 
    )
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
