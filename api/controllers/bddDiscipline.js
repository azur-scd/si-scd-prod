// Ce fichier gère les CRUD pour le modèle BddDiscipline.
// Il ajoute des fonctions avancées pour filtrer par discipline, BDD, et calculer les montants partiels via des relations avec Bdd, Disc et BddGestion.
// Sequelize.Op est utilisé pour créer des conditions complexes sur les jointures.
// Toutes les fonctions renvoient les résultats au format JSON.
    
// On importe la librairie Sequelize
const Sequelize = require('sequelize');

// On récupère l'opérateur logique de Sequelize pour les requêtes avancées (AND, OR, etc.)
const Op = Sequelize.Op;

// On importe le modèle "BddDiscipline" depuis le dossier "../models"
// Ce modèle représente une table qui lie des disciplines à une BDD
const BddDiscipline = require("../models").BddDiscipline;

// On importe le modèle "Bdd" (table principale de BDD)
const Bdd = require("../models").Bdd;

// On importe le modèle "Disc" (table des disciplines)
const Disc = require("../models").Disc;

// On importe le modèle "BddGestion" (table qui gère l'état et le montant d'une BDD pour une année)
const BddGestion = require("../models").BddGestion;

// ===========================
// Liste simple ou filtrée
// ===========================
exports.list = function(req, res) {
    // Si la requête HTTP contient des paramètres de query (ex: /bdddiscipline?champ=valeur)
    if(req.query){
        // On filtre les résultats selon ces paramètres
        BddDiscipline.findAll({where : req.query}).then(rows => {
            // On renvoie les résultats au format JSON
            res.json(rows)
        })
    }
    else {
        // Sinon, on renvoie tous les enregistrements de la table
        BddDiscipline.findAll().then(rows => {
            res.json(rows)
        })
    }
};

// ===========================
// Récupérer un enregistrement par son ID
// ===========================
exports.findById = function(req, res) {
    // findByPk = find by primary key
    // req.params.id correspond à l'ID passé dans l'URL
    BddDiscipline.findByPk(req.params.id).then(rows => {
        res.json(rows)
    })
};

// ===========================
// Récupérer tous les enregistrements liés à une discipline
// ===========================
exports.findByDiscId = function(req, res) {
    // On filtre par disc_id correspondant au paramètre de l'URL
    BddDiscipline.findAll({
        where: {
            disc_id: req.params.discId
        }
    }).then((result) => res.json(result))
};

// ===========================
// Récupérer les disciplines avec leur BDD et le coût associé pour une année donnée
// ===========================
exports.findDiscWithBddCost = function(req, res) {
    BddDiscipline.findAll({
        // Ici, on inclut d'autres modèles liés pour enrichir les données
        include: [
            {
                model: Bdd,
                attributes: ['bdd'], // on ne récupère que le champ 'bdd'
            },
            {
                model: Disc,
                attributes: ['disc','parent_id'], // on récupère le nom et le parent
            },
            {
                model: BddGestion,
                attributes: ['etat','montant_ttc'], // état et montant total
                where: {
                    annee: req.params.year // filtre par année
                },
                on: {
                    [Op.and]: [
                        Sequelize.where(
                            Sequelize.col('BddDiscipline.bdd_id'), // colonne BddDiscipline.bdd_id
                            Op.eq, // opérateur =
                            Sequelize.col('BddGestion.bdd_id') // colonne BddGestion.bdd_id
                        )
                    ],
                }
            }
        ]
    })
    .then(rows => {
        // On transforme les résultats pour calculer le montant partiel selon la quotité
        const resObj = rows.map(row => {
            return {
                "id": row.id,
                "disc_id": row.disc_id,
                "disc": row.Disc.disc,
                "parent_id": row.Disc.parent_id,
                "bdd_id": row.bdd_id,
                "bdd": row.Bdd.bdd,
                "quotite": row.quotite,
                "montant_part": row.BddGestion.montant_ttc * row.quotite / 100,
                "etat": row.BddGestion.etat,
                "montant_ttc": row.BddGestion.montant_ttc
            }
        });
        // On renvoie le tableau transformé
        res.json(resObj)
    })
};

// ===========================
// Récupérer tous les enregistrements pour une BDD spécifique
// ===========================
exports.findByBddId = function(req, res) {
    BddDiscipline.findAll({
        where: {
            bdd_id: req.params.bddId
        }
    }).then((result) => res.json(result))
};

// ===========================
// Mettre à jour un enregistrement
// ===========================
exports.update = function(req, res) {
    BddDiscipline.update(req.body, {
        where: {
            id: req.params.id // filtre par ID
        }
    }).then((result) => res.json(result))
};

// ===========================
// Créer un nouvel enregistrement
// ===========================
exports.create = function(req, res) {
    BddDiscipline.create(req.body).then((result) => res.json(result))
};

// ===========================
// Supprimer un enregistrement
// ===========================
exports.delete = function(req, res) {
    BddDiscipline.destroy({
        where: {
            id: req.params.id // filtre par ID
        }
    }).then((result) => res.json(result))
};
