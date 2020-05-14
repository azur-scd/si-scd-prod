module.exports = function(app) {
  app.get('/', function(req, res, next) {
    res.render('index', {page:'Home', menuId:'home'});
  });
  
app.get('/master', function(req, res, next) {
    res.render('pages/docelec/master', {page:'Docelec : Configuration', menuId:'master'});
  });
  
app.get('/signalement', function(req, res, next) {
    res.render('pages/docelec/signalement', {page:'Docelec : Signalement', menuId:'signalement'});
  }); 
app.get('/gestion', function(req, res, next) {
    res.render('pages/docelec/gestion', {page:'Docelec : Gestion (Exécution et prévision)', menuId:'gestion'});
  }); 
  
app.get('/dashboard-gestion', function(req, res, next) {
    res.render('pages/docelec/dashboard_gestion', {page:'Docelec : Dashboard Suivi Gestion', menuId:'dashboard gestion'});
  });
}
