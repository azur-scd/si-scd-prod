// Fichier CRUD standard pour le modèle StatReport.
// list supporte un filtrage optionnel via req.query.
// Les fonctions create, update et delete interagissent directement avec la base et renvoient le résultat en JSON.
// Très similaire aux fichiers User, Gc, ou BddSignalement de l’application, avec le même pattern.

// Import du modèle StatReport depuis le dossier models
const StatReport = require("../models").StatReport;

// ===========================
// Liste tous les rapports statistiques ou filtre selon req.query
// ===========================
exports.list = function(req, res) {
  if(req.query){
    // Si des paramètres de requête sont présents, on filtre avec where
    StatReport.findAll({where : req.query}).then(rows => {
      res.json(rows) // renvoie les résultats en JSON
    })
  }
  else {
    // Sinon, on retourne tous les rapports
    StatReport.findAll().then(rows => {
        res.json(rows)
    })
  }
};

// ===========================
// Récupérer un rapport par son ID
// ===========================
exports.findById = function(req, res) {
  StatReport.findByPk(req.params.statReportId).then(rows => {
        res.json(rows) // renvoie le résultat en JSON
  })
};  

// ===========================
// Créer un nouveau rapport statistique
// ===========================
exports.create = function(req, res) {
  StatReport.create(req.body).then((result) => res.json(result)) // création et renvoi JSON
};  

// ===========================
// Mettre à jour un rapport existant
// ===========================
exports.update = function(req, res) {
  StatReport.update(req.body, {
        where: {
            id: req.params.statReportId // filtrage par ID
        }
  }).then((result) => res.json(result)) // renvoi JSON
}; 

// ===========================
// Supprimer un rapport
// ===========================
exports.delete = function(req, res) {
  StatReport.destroy({
        where: {
          id: req.params.statReportId // filtrage par ID
        }
  }).then((result) => res.json(result)) // renvoi JSON
};
