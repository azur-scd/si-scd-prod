// Ce fichier server.js fait le rôle de “point d’entrée” de l’application :
// Configure Express et les middlewares.
// Configure Passport et les sessions pour l’authentification.
// Définit le moteur de templates et les fichiers statiques.
// Charge et associe toutes les routes.
// Lance le serveur sur un port spécifique.
// En résumé, c’est le squelette central qui met en place le serveur et les routes pour ton application MVC.
  
// express : framework web Node.js pour gérer les routes et les requêtes HTTP.
const express        = require('express');
// passport : gestion de l’authentification (login, sessions…).
const passport = require('passport')
// express-session : gestion des sessions côté serveur.
const session    = require('express-session')
// cookie-parser : parse les cookies pour pouvoir les utiliser dans les sessions.
const cookieParser = require('cookie-parser')
// connect-busboy : middleware pour gérer le téléchargement de fichiers (form-data, multipart).
const busboy = require('connect-busboy');
// cors : permet de gérer le partage de ressources entre origines (Cross-Origin Resource Sharing).
const cors = require('cors');
// path : module Node.js pour gérer les chemins de fichiers.
const path = require('path');
// http : module Node.js pour créer des serveurs HTTP et faire des requêtes HTTP. Nécessaire pour construire des applications et des API
const http = require('http');


// Création de l’instance Express.
const app            = express();
// Définition du port d’écoute (variable d’environnement ou 7200 par défaut).
const port = process.env.PORT || 7200;

// Middleware pour parser les requêtes
// app.use sert à installer un ou plusieurs « middleware » qui vont intervenir à chaque requête HTTP reçue par ton serveur Express, pour effectuer un traitement particulier (authentification, parsing, upload, etc.).
// Un middleware est une fonction qui reçoit la requête (req), la réponse (res) et une fonction next. Il permet de traiter/modifier la requête ou la réponse, vérifier l’authentification, gérer les fichiers uploadés, parser le corps des requêtes, gérer les erreurs...
// Si tu veux que le middleware ne s’applique qu’à une route : app.use('/api', myMiddleware); → Le middleware ne s’appliquera que pour les routes qui commencent par /api.
  
// express.urlencoded / express.json : pour récupérer les données POST (formulaires ou JSON).
// busboy : pour gérer les fichiers uploadés via multipart/form-data.
// cors : permet aux clients front-end d’accéder à l’API depuis d’autres domaines.

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(busboy());
app.use(cors());

// Configuration de Passport pour l’authentification
// cookieParser & session : configuration des cookies et des sessions pour gérer l’authentification.
// secret : clé pour signer les cookies.
// maxAge : durée de vie du cookie (ici 1 heure).
// sameSite: true et secure: false : configuration de sécurité des cookies.
// passport.initialize() : initialise Passport.
// passport.session() : permet la gestion des sessions persistantes avec Passport.
// require("./api/config/passport.js") : inclut la configuration spécifique de Passport (stratégies, login, etc.).
app.use(cookieParser('keyboard cat'))
app.use(session({ secret: 'keyboard cat',
                  resave: true, 
                  saveUninitialized:true,
                  cookie: {
                    sameSite: true, // i think this is default to false
                    maxAge: 60 * 60 * 1000,
                    secure: false
                  }}));
app.use(passport.initialize()); 
app.use(passport.session()); 
require("./api/config/passport.js")

// Vue et moteur de template
// view engine : utilise EJS pour rendre des templates HTML côté serveur.
// views : chemin vers le dossier contenant les templates.
app.set('view engine', 'ejs');

// Lancement du serveur
const server = http.createServer(app);
// timeout de 30 minutes
server.requestTimeout = 30 * 60 * 1000; // 30 minutes
server.listen(port, () => {
  console.log('We are live on ' + port);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Assets statiques
// Permet de servir des fichiers statiques (CSS, JS, images) depuis le dossier public.
// Les autres lignes commentées montrent des alternatives pour dev ou structure différente.
app.use(express.static(path.join(__dirname, 'public')));
//set path for static assets (dev)
//app.use(express.static('public'));
//test autre solution
//app.use('/static', express.static('public'));

// Chargement des routes
// routes_api : routes de l’API REST, liées aux contrôleurs backend.
// routes_public : routes accessibles côté public/front-end, avec Passport pour la gestion de l’authentification.
// Chaque route est initialisée avec l’instance app et, si besoin, passport.

var routes_api = require('./api/routes/routes'); 
routes_api(app);
 
var routes_public = require('./routes/routes')
routes_public(app,passport);

