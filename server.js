const express        = require('express');
const passport = require('passport')
const session    = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser     = require('body-parser');
const cors = require('cors');
const path = require('path');

const app            = express();

const port = process.env.PORT || 7200;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//For Passport
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

app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log('We are live on ' + port);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set path for static assets (prod)
//app.use(express.static(path.join(__dirname, 'public')));
//set path for static assets (dev)
//app.use(express.static('public'));
//test autre solution
app.use('/static', express.static(__dirname + '/public'));


var routes_api = require('./api/routes/routes'); 
routes_api(app);
 
var routes_public = require('./routes/routes')
routes_public(app,passport);

