// Ce fichier gère les CRUD classiques pour le modèle BddGestion.
// listForGestion et listForGc ajoutent des jointures pour récupérer des informations liées à Bdd et Gc.
// Les résultats sont souvent transformés en objets personnalisés (resObj) pour inclure uniquement les champs utiles et calculés.
// listForGc filtre aussi les périodes de Gc selon l’année (debut et fin).
// Toutes les réponses sont renvoyées en JSON pour le frontend ou les API.

/* Voici un schéma simplifié des relations entre les modèles BddGestion, Bdd et Gc de ton application, avec explications :
+--------------+        +---------------+        +-------+
|   Bdd        |<-------|  BddGestion   |        |  Gc   |
|--------------|        |---------------|        |-------|
| id (PK)      |<------ | bdd_id (FK)   |------> | id    |
| bdd          |        | etat          |        | debut |
| pole_gestion |        | annee         |        | fin   |
| perimetre    |        | montant_ttc   |        | montant_ttc |
| soutien_oa   |        | ...           |        | ...   |
+---------+              +---------------+       +-------+

Explications :

Bdd

Table principale des budgets.

Contient des informations générales comme bdd, pole_gestion, perimetre et soutien_oa.

id est la clé primaire.

BddGestion

Contient les informations de gestion pour un budget précis et pour une année (annee).

bdd_id fait référence à Bdd.id.

etat, montant_ttc, reliquat, etc., stockent l’état et les montants du budget.

Gc

Table des périodes de gestion GC, avec debut, fin et montant_ttc.

Liée à Bdd via Bdd.Gcs pour récupérer les périodes correspondant à une année spécifique.

Relations principales :

BddGestion → Bdd : plusieurs gestionnaires peuvent être liés à un budget (bdd_id).

Bdd → Gc : un budget peut avoir plusieurs périodes GC (Gcs).

Les fonctions listForGestion et listForGc utilisent ces relations pour joindre Bdd et Gc et renvoyer des objets enrichis au frontend.

Résumé fonctionnel :

listForGestion : récupère BddGestion avec les informations générales du budget (pole, perimetre…).

listForGc : récupère BddGestion avec les périodes GC correspondantes à l’année du BddGestion, pour le dashboard.

*/
  

// On importe le modèle "BddGestion" depuis "../models"
// Ce modèle contient les informations de gestion de budgets (montants, état, année, etc.)
const BddGestion = require("../models").BddGestion; 

// On importe le modèle "Bdd" (table principale des budgets)
const Bdd = require("../models").Bdd;

// On importe le modèle "Gc" (table pour le dashboard GC, avec périodes et montants)
const Gc = require("../models").Gc;

// ===========================
// Liste simple ou filtrée
// ===========================
exports.list = function(req, res) {
  // Si la requête contient des paramètres de filtre
  if(req.query){
    BddGestion.findAll({where : req.query}).then(rows => {
      // On renvoie les résultats filtrés en JSON
      res.json(rows)
    })
  }
  else {
    // Sinon, on renvoie tous les enregistrements
    BddGestion.findAll().then(rows => {
      res.json(rows)
    })
  }
};

// ===========================
// Récupérer un enregistrement par son ID
// ===========================
exports.findById = function(req, res) {
  BddGestion.findByPk(req.params.id).then(rows => {
    res.json(rows)
  })
};

// ===========================
// Récupérer tous les enregistrements pour une BDD spécifique
// ===========================
exports.findByBddId = function(req, res) {
  BddGestion.findAll({
    where: {
      bdd_id: req.params.bddId
    }
  }).then((result) => res.json(result))
};

// ===========================
// (Commenté) Exemple de jointure sur BddMetadataSignalement
// ===========================
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

// ===========================
// Mettre à jour un enregistrement
// ===========================
exports.update = function(req, res) {
  BddGestion.update(req.body, {
    where: {
      id: req.params.id // filtre par ID
    }
  }).then((result) => res.json(result))
};

// ===========================
// Créer un nouvel enregistrement
// ===========================
exports.create = function(req, res) {
  BddGestion.create(req.body).then((result) => res.json(result))
};

// ===========================
// Supprimer un enregistrement
// ===========================
exports.delete = function(req, res) {
  BddGestion.destroy({
    where: {
      id: req.params.id // filtre par ID
    }
  }).then((result) => res.json(result))
};

// ===========================
// Liste des BddGestion avec jointure sur Bdd (pour gestion)
// ===========================
exports.listForGestion = function(req, res) {
  var q;

  // Si query params présents, on filtre et on inclut le modèle Bdd
  if(req.query) {
    q = {
      where: req.query,
      include: [{
        model: Bdd,
        attributes: ['id', 'bdd', 'pole_gestion','perimetre','soutien_oa']
      }]
    }
  }
  else { // Sinon, on inclut simplement Bdd sans filtre
    q = {
      include: [{
        model: Bdd,
        attributes: ['id', 'bdd', 'pole_gestion','perimetre','soutien_oa']
      }]
    }
  }

  // Requête Sequelize
  BddGestion.findAll(q).then(rows => {
    // On transforme les résultats pour renvoyer un objet avec tous les champs utiles
    const resObj = rows.map(row => {
      return {
        "id": row.id,
        "bdd_id": row.bdd_id,
        "bdd": row.Bdd.bdd,
        "pole": row.Bdd.pole_gestion,
        "perimetre": row.Bdd.perimetre,
        "soutien_oa": row.Bdd.soutien_oa,
        "etat": row.etat,
        "annee": row.annee,
        "compte_recherche": row.compte_recherche,
        "montant_initial": row.montant_initial,
        "devise": row.devise,
        "taux_change": row.taux_change,
        "montant_ht": row.montant_ht,
        "part_tva1": row.part_tva1,
        "taux_tva1": row.taux_tva1,
        "part_tva2": row.part_tva2,
        "taux_tva2": row.taux_tva2,
        "taux_recup_tva": row.taux_recup_tva,
        "taux_tva_frais_gestion": row.taux_tva_frais_gestion,
        "montant_frais_gestion": row.montant_frais_gestion,
        "montant_ttc_avant_recup": row.montant_ttc_avant_recup,
        "montant_tva_avant_recup": row.montant_tva_avant_recup,
        "montant_tva_apres_recup": row.montant_tva_apres_recup,
        "montant_ttc": row.montant_ttc,
        "last_estime": row.last_estime,
        "reliquat": row.reliquat,
        "surcout_uca": row.surcout_uca,
        "refacturation": row.refacturation,
        "commentaire": row.commentaire,
        "createdAt": row.createdAt,
        "updatedAt": row.updatedAt
      }
    });
    res.json(resObj)
  })
};

// ===========================
// Liste pour dashboard GC avec join sur Bdd et Gc, filtrée par année et état
// ===========================
exports.listForGc = function(req, res) {
  var q;

  // Si query params présents, on filtre et on inclut Bdd et Gc
  if(req.query) {
    q = {
      where: req.query,
      include: [{
        model: Bdd,
        attributes: ['id', 'bdd', 'pole_gestion'],
        include: [{
          model: Gc,
          attributes: ['id', 'debut', 'fin', 'montant_ttc']
        }]
      }]
    }
  } else { // Sinon, on inclut simplement Bdd et Gc sans filtre
    q = {
      include: [{
        model: Bdd,
        attributes: ['id', 'bdd', 'pole_gestion'],
        include: [{
          model: Gc,
          attributes: ['id', 'debut', 'fin', 'montant_ttc']
        }]
      }]
    }
  }

  // Requête Sequelize
  BddGestion.findAll(q).then(rows => {
    // Transformation des résultats
    const resObj = rows.map(row => {
      var obj = {}
      obj["id"] = row.id
      obj["bdd_id"] = row.bdd_id
      obj["bdd"] = row.Bdd.bdd
      obj["pole"] = row.Bdd.pole_gestion
      obj["etat"] = row.etat
      obj["annee"] = row.annee
      obj["montant_ttc_avant_recup"] = row.montant_ttc_avant_recup
      obj["montant_ttc"] = row.montant_ttc
      obj["reliquat"] = row.reliquat

      // Si le budget a des Gcs associés
      if(row.Bdd.Gcs) {
        // Filtrer les Gcs correspondant à l'année du BddGestion
        row.Bdd.Gcs.filter(function(d) {
          return (parseInt(d.debut) <= parseInt(row.annee)) & (parseInt(d.fin) >= parseInt(row.annee))
        })
        // On mappe le résultat pour récupérer les infos GC
        .map(function(d) {
          obj["debut_gc"] = d.debut
          obj["fin_gc"] = d.fin
          obj["montant_ttc_gc"] = d.montant_ttc
        })
      }

      obj["createdAt"] = row.createdAt
      obj["updatedAt"] = row.updatedAt
      return obj
    });

    res.json(resObj)
  })
};
