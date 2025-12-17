// Ce fichier initialise Sequelize et connecte la base.
// Il charge automatiquement tous les fichiers modèles du dossier models.
// Il gère les associations entre modèles si définies.
// Il exporte un objet db central, utilisé dans les contrôleurs pour accéder aux modèles et à la base.

// Voici un schéma explicatif simplifié de la manière dont ton index.js relie les modèles à Sequelize dans l’architecture MVC de ton application :
/*
                   ┌───────────────────┐
                   │   config/config.json │
                   └─────────┬─────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  index.js (models) │
                    └─────────┬─────────┘
                              │
       ┌──────────────────────┼───────────────────────┐
       │                      │                       │
       ▼                      ▼                       ▼
┌────────────┐        ┌─────────────┐          ┌─────────────┐
│ Sequelize  │        │   db object │          │  Models     │
│ instance   │◀───────┤   (db)      │─────────▶│  Bdd.js     │
│ (sequelize)│        │             │          │  User.js    │
└────────────┘        └─────────────┘          │  StatReport│
                                                │  StatSuivi │
                                                │  BddStat   │
                                                │  ...       │
                                                └─────────────┘


1. config/config.json
 - Contient les paramètres de connexion à la base (DB, username, password, options).
 - index.js lit ce fichier selon l’environnement (development ou production).
2. index.js (models)
 - Initialise Sequelize avec les paramètres de config.
 - Vérifie la connexion à la base.
 - Parcourt tous les fichiers du dossier models et les charge dynamiquement.
 - Crée les relations entre modèles si associate() existe.
3. Sequelize instance
 - C’est l’objet sequelize passé à chaque modèle lors de sa définition.
 - Permet aux modèles d’interagir avec la base (CRUD, requêtes complexes).
4. db object
 - Contient tous les modèles comme propriétés (db.Bdd, db.User, etc.).
 - Contient aussi db.sequelize et db.Sequelize pour l’accès global à Sequelize.
 - Sert de point central pour tous les contrôleurs.
5. Models
 - Chaque fichier modèle (Bdd.js, User.js, etc.) est chargé et défini par Sequelize.
 - Les relations (hasMany, belongsTo) sont créées via la méthode associate().

Résumé fonctionnel : Quand un contrôleur importe db :
const { Bdd, User } = require('../models');
Bdd et User sont les modèles prêts à être utilisés pour les requêtes SQL.
db.sequelize peut être utilisé pour les transactions ou requêtes brutes.

Voici un schéma complet et détaillé de l’interaction entre les contrôleurs, index.js (modèles), et la base de données dans ton application MVC :

         ┌───────────────┐
         │  Client/API   │
         │ (requête HTTP)│
         └───────┬───────┘
                 │
                 ▼
       ┌─────────────────────┐
       │  Route / Router     │
       │  (ex: /users, /bdd)│
       └─────────┬──────────┘
                 │ appelle
                 ▼
       ┌─────────────────────┐
       │  Contrôleur         │
       │  (ex: userController│
       │       bddController)│
       └─────────┬──────────┘
                 │ utilise
                 ▼
       ┌─────────────────────┐
       │  db object (index.js│
       │  dans models/)      │
       │                     │
       │  - db.User          │─────┐
       │  - db.Bdd           │     │
       │  - db.StatReport    │     │
       │  - db.sequelize     │     │
       │  - db.Sequelize     │     │
       └─────────┬──────────┘     │
                 │ passe Sequelize│
                 ▼                ▼
       ┌─────────────────────────────┐
       │ Modèle Sequelize (User.js, │
       │ Bdd.js, etc.)               │
       │ - définit les colonnes      │
       │ - définit les relations     │
       │   via associate()           │
       └─────────┬──────────────────┘
                 │ mappe et exécute
                 ▼
       ┌─────────────────────┐
       │ Base de données SQL │
       │  (tables Users, Bdd,│
       │   StatReport, etc.) │
       └─────────────────────┘


Flux de données détaillé :
1. Client/API
 - Envoie une requête HTTP (GET, POST, PUT, DELETE) vers ton serveur Node.js.
2. Route / Router
 - Transmet la requête au contrôleur approprié (userController, bddController, etc.).
3. Contrôleur
 - Exécute la logique métier.
 - Utilise les modèles importés via db pour interagir avec la base de données.
Exemple :
const { User } = require('../models');
User.findAll().then(rows => res.json(rows));
4. db object (index.js)
 - Centralise tous les modèles et la connexion Sequelize.
 - Sert de point d’accès unique pour tous les contrôleurs.
5. Modèles Sequelize
 - Définissent la structure des tables (colonnes, types).
 - Définissent les relations entre tables (hasMany, belongsTo).
 - Exécutent les requêtes SQL via Sequelize (ORM).
6. Base de données
- Stocke physiquement les données.
- Sequelize traduit les appels des modèles en SQL.

Résumé :
Contrôleur → logique métier + appelle db/modèles
db/index.js → centralise les modèles et la connexion Sequelize
Modèles → définissent tables et relations + CRUD
Sequelize → traduit en SQL et communique avec la base

*/

'use strict'; 
// Active le mode strict de JavaScript pour éviter certaines erreurs silencieuses.

const fs = require('fs');
// Module Node.js pour manipuler le système de fichiers (lecture, écriture, etc).

const path = require('path');
// Module Node.js pour manipuler les chemins de fichiers de manière portable.

const Sequelize = require('sequelize');
// Import de Sequelize, ORM pour interagir avec la base de données.

const basename = path.basename(__filename);
// Récupère le nom du fichier courant (ici "index.js") pour l'exclure plus tard.

const env = process.env.NODE_ENV || 'development';
// Détermine l'environnement courant (ex: development, production, test), défaut "development".

const prod = process.env.NODE_ENV || 'production';
// Variable "prod" qui pointe également sur l'environnement (ici par défaut "production"). 
// Remarque : c’est redondant avec "env".

//const config = require(__dirname + '/../config/config.json')[env];
const config = require(__dirname + '/../config/config.json')[prod];
// Charge la configuration de la base de données depuis config.json
// selon l'environnement courant (ici 'production').

const db = {};
// Objet vide qui va contenir tous les modèles et l’instance Sequelize.

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
  // Si config indique une variable d'environnement (ex: DATABASE_URL),
  // on l'utilise pour se connecter.
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
  // Sinon on utilise les paramètres explicites de config.json (nom db, user, mdp, options).
}

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    // Test de la connexion à la base et log si OK
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    // Log en cas d'erreur de connexion
  });

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    // Filtre tous les fichiers du dossier models : 
    // - pas de fichiers cachés (qui commencent par '.')
    // - exclut ce fichier index.js
    // - prend uniquement les fichiers .js
  })
  .forEach(file => {
    const modelDefiner = require(path.join(__dirname, file));
    // Charge le fichier modèle
    const model = modelDefiner(sequelize, Sequelize.DataTypes);
    // Définit le modèle en passant l'instance sequelize et les types de données
    db[model.name] = model;
    // Stocke le modèle dans l'objet db avec comme clé son nom
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
    // Si le modèle a une méthode "associate", on l'exécute
    // pour créer les relations entre modèles (hasMany, belongsTo, etc.)
  }
});

db.sequelize = sequelize;
// Ajoute l'instance Sequelize dans l'objet db pour pouvoir l'utiliser ailleurs

db.Sequelize = Sequelize;
// Ajoute la classe Sequelize dans l'objet db pour accéder aux classes/types

module.exports = db;
// Exporte l'objet db complet, qui contient :
// - tous les modèles
// - l'instance Sequelize
// - la classe Sequelize
