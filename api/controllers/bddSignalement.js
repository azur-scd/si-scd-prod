// Ce fichier gère CRUD pour le modèle BddSignalement.
// Il inclut des fonctionnalités d’import/export de fichiers via busboy et fs.
// listForSignalement et listForPrimo créent des objets enrichis avec jointure sur Bdd.
// Les données peuvent être renvoyées en JSON ou préparées pour un export XML type Primo.
// La répétition de listForSignalement est présente, mais le fonctionnement reste le même

/* Voici un schéma simplifié des relations entre BddSignalement et Bdd dans ton application :
+---------+        +------------------+
|   Bdd   |<-------|  BddSignalement  |
|---------|        |-----------------|
| id (PK) |        | id (PK)         |
| bdd     |        | bdd_id (FK)     |
| signalement |     | nom_court       |
| ...     |        | source          |
+---------+        | editeur         |
                   | url             |
                   | proxified_url   |
                   | disc            |
                   | langue          |
                   | type_contenu    |
                   | type_base       |
                   | type_acces      |
                   | note_acces      |
                   | description     |
                   | tuto            |
                   | icone           |
                   | new             |
                   | alltitles       |
                   | uca             |
                   | commentaire     |
                   | createdAt       |
                   | updatedAt       |
                   +-----------------+


Explications :
1. Bdd
-- Table principale des bases de données.
-- Contient des informations générales comme bdd et un flag signalement pour indiquer si la BDD doit être signalée.
-- id est la clé primaire.
2. BddSignalement
-- Contient des informations détaillées sur chaque signalement d’une BDD.
-- bdd_id fait référence à Bdd.id.
-- Stocke des champs comme le nom court, source, éditeur, URL, discipline, langue, type de contenu et autres métadonnées.

Relations principales :
- BddSignalement → Bdd : chaque signalement est lié à une BDD spécifique via bdd_id.
- Les fonctions listForSignalement et listForPrimo utilisent cette relation pour récupérer uniquement les BDD actives pour signalement et formater les données pour différents usages (JSON simple ou export Primo).

Résumé fonctionnel :
- CRUD standard pour BddSignalement.
- Import/Export de fichiers pour gérer des statistiques ou contenus associés.
- Jointures avec Bdd pour filtrer par signalement actif et enrichir les informations envoyées au frontend ou pour Primo.

*/

// Import du modèle BddSignalement, qui représente les signalements de bases de données
const BddSignalement = require("../models").BddSignalement;

// Import du modèle Bdd, table principale des bases de données
const Bdd = require("../models").Bdd;

// Import du module natif fs pour manipuler les fichiers
var fs = require('fs');

// Import de connect-busboy pour gérer les fichiers envoyés via multipart/form-data
var busboy = require('connect-busboy');

// (Commenté) module pour transformer un objet JS en XML
// var o2x = require('object-to-xml');

// ===========================
// Liste simple ou filtrée
// ===========================
exports.list = function(req, res) {
  // Si des paramètres de requête sont présents, on filtre
  if(req.query){
    BddSignalement.findAll({where : req.query}).then(rows => {
      res.json(rows)
    })
  }
  else { // Sinon, on retourne tous les signalements
    BddSignalement.findAll().then(rows => {
        res.json(rows)
    })
  }
};

// ===========================
// Récupérer un signalement par son ID
// ===========================
exports.findById = function(req, res) {
    BddSignalement.findByPk(req.params.id).then(rows => {
        res.json(rows)
    })
};   

// ===========================
// Récupérer tous les signalements d'une BDD spécifique
// ===========================
exports.findByBddId = function(req, res) {
  BddSignalement.findAll({
    where: {
      bdd_id: req.params.bddId
    }
  }).then((result) => res.json(result))
};   

// ===========================
// Mettre à jour un signalement
// ===========================
exports.update = function(req, res) {
    BddSignalement.update(req.body, {
        where: {
            id: req.params.id // filtrage par ID
        }
    }).then((result) => res.json(result))
}; 
 
// ===========================
// Créer un nouveau signalement
// ===========================
exports.create = function(req, res) {
  BddSignalement.create(req.body).then((result) => res.json(result))
};

// ===========================
// Supprimer un signalement
// ===========================
exports.delete = function(req, res) {
  BddSignalement.destroy({
      where: {
        id: req.params.id // filtrage par ID
      }
  }).then((result) => res.json(result))
};

// ===========================
// Importer un fichier via formulaire (upload)
// ===========================
exports.import = function(req, res) {
  var fstream;
  // On pipe la requête vers busboy
  req.pipe(req.busboy);
  // Lorsqu'un fichier est détecté
  req.busboy.on('file', function (fieldname, file, filename) {
      console.log("Uploading: " + filename); 
      // On crée un flux d'écriture vers le dossier ./uploads
      fstream = fs.createWriteStream('./uploads/' + filename);
      // On pipe le fichier vers ce flux
      file.pipe(fstream);
      // Quand l'écriture est terminée, on redirige l'utilisateur
      fstream.on('close', function () {
          res.redirect('back');
      });
  });
}; 

// ===========================
// Télécharger un fichier existant
// ===========================
exports.export = function (req, res) {
  let filenameWithPath = './uploads/stats_ebooks/' + req.params.filename;
  res.download(filenameWithPath , req.params.filename)
};

// ===========================
// Lire les fichiers d'un répertoire pour une année donnée
// ===========================
exports.read = function(req, res) {
  fs.readdir('./uploads/stats_ebooks/'+ req.params.year + '/', function (err, files) {
    var arr = []
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
      arr.push({"file":file}) 
    });
    res.json(arr)
  })
};

// ===========================
// Liste des signalements avec jointure sur Bdd, filtrage signalement = 1
// ===========================
exports.listForSignalement = function (req, res) {
  var q;
  if (req.query) {
    // Si query params présents, on filtre et on inclut Bdd
    q = {
      where: req.query,
      include: [{
        model: Bdd,
        attributes: ['id', 'bdd'],
        where: { signalement: 1 } // Bdd concernées uniquement
      }]
    }
  }
  else {
    // Sinon on inclut simplement Bdd avec filtre signalement
    q = {
      include: [{
        model: Bdd,
        attributes: ['id', 'bdd'],
        where: { signalement: 1 }
      }]
    }
  }
  // On récupère les signalements avec jointure
  BddSignalement.findAll(q).then(rows => {
    // Transformation des résultats pour renvoyer uniquement les champs utiles
    const resObj = rows.map(row => {
      return {
        "id": row.id,
        "bdd_id": row.bdd_id,
        "bdd": row.Bdd.bdd,
        "nom_court": row.nom_court,
        "source": row.source,
        "editeur": row.editeur,
        "url": row.url,
        "proxified_url": row.proxified_url,
        "disc": row.disc,
        "langue": row.langue,
        "type_contenu": row.type_contenu,
        "type_base": row.type_base,
        "type_acces": row.type_acces,
        "note_acces": row.note_acces,
        "description": row.description,
        "tuto": row.tuto,
        "icone": row.icone,
        "new": row.new,
        "alltitles": row.alltitles,
        "uca": row.uca,
        "commentaire": row.commentaire,
        "createdAt": row.createdAt,
        "updatedAt": row.updatedAt
      }
    });
    res.json(resObj)
  })
};

// ===========================
// (Identique à listForSignalement) – jointure signalement
// ===========================
exports.listForSignalement = function (req, res) {
  // Répétition du même code que ci-dessus
  var q;
  if (req.query) {
    q = {
      where: req.query,
      include: [{
        model: Bdd,
        attributes: ['id', 'bdd'],
        where: { signalement: 1 }
      }]
    }
  }
  else {
    q = {
      include: [{
        model: Bdd,
        attributes: ['id', 'bdd'],
        where: { signalement: 1 }
      }]
    }
  }
  BddSignalement.findAll(q).then(rows => {
    const resObj = rows.map(row => {
      return {
        "id": row.id,
        "bdd_id": row.bdd_id,
        "bdd": row.Bdd.bdd,
        "nom_court": row.nom_court,
        "source": row.source,
        "editeur": row.editeur,
        "url": row.url,
        "proxified_url": row.proxified_url,
        "disc": row.disc,
        "langue": row.langue,
        "type_contenu": row.type_contenu,
        "type_base": row.type_base,
        "type_acces": row.type_acces,
        "note_acces": row.note_acces,
        "description": row.description,
        "tuto": row.tuto,
        "icone": row.icone,
        "new": row.new,
        "alltitles": row.alltitles,
        "uca": row.uca,
        "commentaire": row.commentaire,
        "createdAt": row.createdAt,
        "updatedAt": row.updatedAt
      }
    });
    res.json(resObj)
  })
};

// ===========================
// Export spécifique pour Primo (format adapté aux plateformes de recherche)
// ===========================
exports.listForPrimo = function (req, res) {
  BddSignalement.findAll({
    include: [{
      model: Bdd,
      attributes: ['id', 'bdd'],
      where: { signalement: 1 } // Bdd concernées
    }]
  }).then(rows => {
    // Transformation des données au format attendu par Primo
    const Resource = rows.map(row => {
      return {
        LinkId: row.Bdd.id,
        ResourceId: row.Bdd.id,
        Title: row.Bdd.bdd,
        ShortTitle: row.nom_court,
        TitleSort: row.nom_court,
        Source: row.source,
        ProxiedURL: row.proxified_url,
        Publisher: row.editeur,
        Type: "plateforme",
        SubjectName: row.disc,
        Language: row.langue,
        ContentType: row.type_contenu,
        AccessType: row.type_acces,
        AccessNote: row.note_acces,
        BaseType: row.type_base,
        Note: row.description,
        Tutorial: row.tuto,
        Display: "Y",
        Icone: row.icone,
        allTitles: row.alltitles
      }
    });

    // On encapsule dans un objet Resource et on renvoie (au format JSON, XML commenté)
    var obj = {};
    obj.Resource = Resource;
    res.send(obj)
  })
};
