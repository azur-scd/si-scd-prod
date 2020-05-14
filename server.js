const express        = require('express');
const bodyParser     = require('body-parser');
const cors = require('cors');
const path = require('path');

const app            = express();

const port = process.env.PORT || 7200;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log('We are live on ' + port);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set path for static assets
app.use(express.static(path.join(__dirname, 'public')));

// routes
/*app.get('/', function(req, res, next) {
    res.render('index', {page:'Home', menuId:'home'});
  });
  
app.get('/about', function(req, res, next) {
    res.render('about', {page:'About Us', menuId:'about'});
  });
  
app.get('/signalement', function(req, res, next) {
    res.render('pages/docelec/signalement', {page:'Contact Us', menuId:'contact'});
  });*/

  var routes_api = require('./api/routes/routes'); 
  routes_api(app);

  var routes_public = require('./routes/routes')
  routes_public(app);