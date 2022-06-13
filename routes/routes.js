var passport = require("passport");
const { json } = require("body-parser");

module.exports = function(app) {
                     /*--------  Home page -------*/

  app.get('/', function(req, res, next) {
    res.render('index', {page:'Home', menuId:'home'});
  });

  app.get('/error', function(req, res, next) {
    res.render('error', {page:'Erreur', menuId:'error',message:"erreur"});
  });

                      /*--------  authentification -------*/

  app.get('/login', function(req, res, next) {
    res.render('pages/auth/login', {page:'Login', menuId:'login',mess:''});
  });

  app.post('/login', 
  passport.authenticate('local-signin', { failureRedirect: './login' }),
  function(req, res) {
    console.log(req.user)
    switch (req.user.groupe) {
      case 'admin':
        res.redirect('./admin-config');
        break;
      case 'docelec':
        res.redirect('./admin-docelec-master');
        break;
	  case 'horaires':
	    res.redirect("http://si-scd.unice.fr/si-scd/modules/horaires/admin/index.html");
        break;
	  case 'guest':
	    res.redirect('./admin-docelec-master');
        break;
      default:
        console.log("no default page yet");
    }
  });


app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('./');
  });

  app.get('/cas_login', 
  passport.authenticate('cas-signin', { failureRedirect: './error' }),
  function (err, user, info) {
    if (err) {
      return next(err);
    }
  
    if (!user) {
      req.session.messages = info.message;
      return res.redirect('./error');
    }
  
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      console.log(user)
      //req.session.messages = '';
      return res.redirect('./admin/docelec/master');
    });
  });  

                               /*--------  Admin pages -------*/

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
app.get('/admin-docelec-suivistats', function(req, res, next) {
    res.render('pages/docelec/suivi_stats', {page:"Docelec : Suivi de la saisie des statistiques", menuId:'statistiques suivi saisie',user: req.user});
  }); 
app.get('/admin-docelec-dashboardgestion', isLoggedIn,function(req, res, next) {
    res.render('pages/docelec/dashboard_gestion', {page:'Docelec : Dashboard Suivi Gestion', menuId:'dashboard gestion',user: req.user});
  }); 
  app.get('/admin-docelec-dashboardgc', isLoggedIn,function(req, res, next) {
    res.render('pages/docelec/dashboard_gc', {page:'Docelec : Dashboard Suivi GC', menuId:'dashboard gc',user: req.user});
  }); 
  app.get('/admin-config', isLoggedIn,function(req, res, next) {
    res.render('pages/admin/config', {page:'Admin : Configuration des utilisateurs et des sites', menuId:'admin config',user: req.user});
  });
  app.get('/admin-disc', isLoggedIn,function(req, res, next) {
    res.render('pages/admin/disc', {page:'Admin : Référentiel des disciplines', menuId:'admin disc',user: req.user});
  });
  //help page
  app.get('/admin-help', function(req, res, next) {
    res.render('pages/admin/help', {page:'Aide/Documentation', menuId:'admin help'});
  });

                                      /*--------  Public pages -------*/

 app.get('/public-iub-explore', function(req, res, next) {
    res.render('pages/iub/explore', {page:'IUB : Exploration', menuId:'iub explore'});
});
app.get('/public-docelec-dashboard', function(req, res, next) {
    res.render('pages/docelec/public_dashboard', {page:'Docelec : Dashboard', menuId:'docelec dashboard'});
  });
app.get('/public-apps-app', function(req, res, next) {
    res.render('pages/apps/app', {page:'Applications', menuId:'applications'});
  });
app.get('/public-apps-utils', function(req, res, next) {
    res.render('pages/apps/utils', {page:'Utilitaires en ligne', menuId:'utilitaires'});
  });
app.get('/public-apps-utilebooks', function(req, res, next) {
    res.render('pages/apps/utilebooks', {page:'Utilitaires Ebooks', menuId:'utilitaires ebooks'});
  });
app.get('/public-apps-utiladmingen', function(req, res, next) {
    res.render('pages/apps/utiladmingen', {page:'Utilitaires AdminGen', menuId:'utilitaires admingen'});
  });


  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('./login');   
}

}
