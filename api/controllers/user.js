// Fichier CRUD complet pour le modèle User.
// La création d’utilisateur inclut hachage sécurisé du mot de passe avec bcryptjs.
// list supporte un filtrage via req.query.
// Toutes les réponses sont envoyées au format JSON.
	


// Import du modèle User depuis le dossier models
const User = require("../models").User;

// Import de bcryptjs pour le hachage des mots de passe
var bcryptjs = require('bcryptjs');

// Génération d’un sel synchronisé pour le hachage (10 rounds)
var salt = bcryptjs.genSaltSync(10);

// ===========================
// Liste tous les utilisateurs ou filtre selon req.query
// ===========================
exports.list = function(req, res) {
  if(req.query){
    // Si des paramètres de requête sont présents, on filtre avec where
    User.findAll({where : req.query}).then(rows => {
      res.json(rows) // renvoie les résultats en JSON
    })
  }
  else {
    // Sinon, on retourne tous les utilisateurs
    User.findAll().then(rows => {
        res.json(rows)
    })
  }
};

// ===========================
// Récupérer un utilisateur par son ID
// ===========================
exports.findById = function(req, res) {
    User.findByPk(req.params.userId).then(rows => {
        res.json(rows)
    })
};  

// ===========================
// Créer un nouvel utilisateur avec mot de passe haché
// ===========================
exports.create = function(req, res) {
    // Génération du sel (async)
    bcryptjs.genSalt(10, function(err, salt) {
        // Hachage du mot de passe fourni
        bcryptjs.hash(req.body.password, salt, function(err, hash) {
            // Construction de l’objet utilisateur à créer
            var newUser = {
                "username": req.body.username,
                "password": hash, // mot de passe haché
                "bu_id": req.body.bu_id,
                "groupe": req.body.groupe
            }
            // Création dans la base et renvoi du résultat JSON
            User.create(newUser).then((result) => res.json(result))
        });
    });
}; 

// ===========================
// Mettre à jour un utilisateur existant
// ===========================
exports.update = function(req, res) {
    User.update(req.body, {
        where: {
            id: req.params.userId // filtrage par ID
        }
    }).then((result) => res.json(result))
}; 

// ===========================
// Supprimer un utilisateur
// ===========================
exports.delete = function(req, res) {
    User.destroy({
        where: {
          id: req.params.userId // filtrage par ID
        }
    }).then((result) => res.json(result))
};
