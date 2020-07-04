var passport = require("passport");
const { json } = require("body-parser");

module.exports = function(app) {
  app.get('/', function(req, res, next) {
    res.render('index', {page:'Home', menuId:'home'});
  });

  app.get('/error', function(req, res, next) {
    res.render('error', {page:'Erreur', menuId:'error',message:"erreur"});
  });

  app.get('/login', function(req, res, next) {
    res.render('pages/auth/login', {page:'Login', menuId:'login',mess:''});
  });

  app.post('/login', 
  passport.authenticate('local-signin', { failureRedirect: './login' }),
  function(req, res) {
    console.log(req.user)
    res.redirect('./');
  });


app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('./login');
  });

  app.get('/cas_login', 
  passport.authenticate('cas-signin', { failureRedirect: './error' }),
  function (err, user, info) {
    if (err) {
      return next(err);
    }
  
    if (!user) {
      req.session.messages = info.message;
      return res.redirect('./');
    }
  
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      console.log(user)
      req.session.messages = '';
      return res.redirect('./');
    });
  });  

app.get('/admin-docelec-master', isLoggedIn, function(req, res, next) {
    res.render('pages/docelec/master', {page:'Docelec : Configuration', menuId:'master',user: req.user});
  });
  
app.get('/admin-docelec-signalement', isLoggedIn, function(req, res, next) {
    res.render('pages/docelec/signalement', {page:'Docelec : Signalement', menuId:'signalement',user: req.user});
  }); 
app.get('/admin-docelec-gestion', isLoggedIn, function(req, res, next) {
    res.render('pages/docelec/gestion', {page:'Docelec : Gestion (Exécution et prévision)', menuId:'gestion',user: req.user});
  }); 
app.get('/admin-docelec-stats', function(req, res, next) {
    res.render('pages/docelec/stats', {page:"Docelec : Statistiques d'usage", menuId:'statistiques',user: req.user});
  }); 
app.get('/admin-docelec-dashboardgestion', isLoggedIn,function(req, res, next) {
    res.render('pages/docelec/dashboard_gestion', {page:'Docelec : Dashboard Suivi Gestion', menuId:'dashboard gestion',user: req.user});
  }); 

  app.get('/admin-config', isLoggedIn,function(req, res, next) {
    res.render('pages/admin/config', {page:'Admin : Configuration des utilisateurs et des sites', menuId:'admin config',user: req.user});
  });
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('./login');   
}

}
