// Fichier CRUD complet pour le modèle StatSuivi.
// list supporte un filtrage optionnel via req.query.
// findByBddId permet de filtrer les enregistrements par BDD spécifique.
// Les fonctions create, update et delete interagissent directement avec la base et renvoient le résultat au format JSON.
// Même structure que les autres fichiers CRUD de ton application (User, Gc, StatReport, etc.).

// Import du modèle StatSuivi depuis le dossier models
const StatSuivi = require("../models").StatSuivi;

// ===========================
// Liste tous les enregistrements StatSuivi ou filtre selon req.query
// ===========================
exports.list = function(req, res) {
  if(req.query){
    // Si des paramètres de requête sont présents, on filtre avec where
    StatSuivi.findAll({where : req.query}).then(rows => {
      res.json(rows) // renvoie les résultats en JSON
    })
  }
  else {
    // Sinon, on retourne tous les enregistrements
    StatSuivi.findAll().then(rows => {
        res.json(rows)
    })
  }
};

// ===========================
// Récupérer un enregistrement StatSuivi par son ID
// ===========================
exports.findById = function(req, res) {
    StatSuivi.findByPk(req.params.id).then(rows => {
        res.json(rows) // renvoie le résultat en JSON
    })
};  

// ===========================
// Récupérer tous les StatSuivi associés à une BDD spécifique
// ===========================
exports.findByBddId = function(req, res) {
    StatSuivi.findAll({
      where: {
        bdd_id: req.params.bddId // filtre sur bdd_id
      }
    }).then((result) => res.json(result))
};

// ===========================
// Créer un nouvel enregistrement StatSuivi
// ===========================
exports.create = function(req, res) {
    StatSuivi.create(req.body).then((result) => res.json(result)) // création et renvoi JSON
};  

// ===========================
// Mettre à jour un enregistrement StatSuivi existant
// ===========================
exports.update = function(req, res) {
    StatSuivi.update(req.body, {
        where: {
            id: req.params.id // filtrage par ID
        }
    }).then((result) => res.json(result)) // renvoi JSON
}; 

// ===========================
// Supprimer un enregistrement StatSuivi
// ===========================
exports.delete = function(req, res) {
    StatSuivi.destroy({
        where: {
          id: req.params.id // filtrage par ID
        }
    }).then((result) => res.json(result)) // renvoi JSON
};
