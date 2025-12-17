// Fichier CRUD standard pour le modèle Gc (groupements de commande)
// Fonctions disponibles : list, findById, findByBddId, create, update, delete.
// list supporte un filtrage optionnel via req.query.
// Toutes les réponses sont envoyées au format JSON.

// Import du modèle Gc depuis le dossier models
const Gc = require("../models").Gc;

// ===========================
// Liste des enregistrements Gc
// ===========================
exports.list = function(req, res) {
  if(req.query){
    // Si des paramètres de requête sont présents, on filtre avec where
    Gc.findAll({where : req.query}).then(rows => {
      res.json(rows) // renvoie les résultats en JSON
    })
  }
  else {
    // Sinon, on retourne tous les enregistrements
    Gc.findAll().then(rows => {
        res.json(rows)
    })
  }
};

// ===========================
// Récupérer un enregistrement Gc par son ID
// ===========================
exports.findById = function(req, res) {
    // findByPk utilise la clé primaire
    Gc.findByPk(req.params.gcId).then(rows => {
        res.json(rows)
    })
};

// ===========================
// Récupérer tous les Gc associés à une BDD spécifique
// ===========================
exports.findByBddId = function(req, res) {
  Gc.findAll({
    where: {
      bdd_id: req.params.bddId // filtre sur bdd_id
    }
  }).then((result) => res.json(result))
};

// ===========================
// Créer un nouvel enregistrement Gc
// ===========================
exports.create = function(req, res) {
    Gc.create(req.body).then((result) => res.json(result))
};  

// ===========================
// Mettre à jour un enregistrement Gc existant
// ===========================
exports.update = function(req, res) {
    Gc.update(req.body, {
        where: {
            id: req.params.gcId // filtrage par ID
        }
    }).then((result) => res.json(result))
}; 

// ===========================
// Supprimer un enregistrement Gc
// ===========================
exports.delete = function(req, res) {
    Gc.destroy({
        where: {
          id: req.params.gcId // filtrage par ID
        }
    }).then((result) => res.json(result))
};
