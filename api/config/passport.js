const User = require("../models").User;
var passport = require("passport")
const Strategy = require('passport-local').Strategy; 
const CasStrategy = require('passport-cas').Strategy;   
const bcrypt = require('bcrypt');
const saltRounds = 10;


passport.use('local-signin',new Strategy(
    function(username, password, done) {
        var isValidPassword = function(userpass, password) {
            return bcrypt.compareSync(password, userpass); 
        }
        User.findOne({
            where: {
                username: username
                   }
           }).then(function (user) {
        if (!user) { return done(null, false, {
            message: 'Incorrect username.'
        }); }
        if (!isValidPassword(user.password, password)) { return done(null, false, {
            message: 'Incorrect password.'
        }); } 
        return done(null, user);
      });
    }));

    passport.use('cas-signin',new CasStrategy({
        ssoBaseURL: 'https://login.unice.fr',
        serverBaseURL: 'http://si-scd.unice.fr/si-scd-prod'
      }, function(login, done) {
        User.findOne({
            where: {
                login: login
                   }
           }).then(function (user) {
          if (!user) {
            return done(null, false, {message: 'Unknown user'});
          }
          return done(null, user);
        });
      }));

    passport.serializeUser(function(user, done) {
        console.log('serialize: ' + user.id)
       done(null, user.id);
    });
          
    passport.deserializeUser(function(id, done) {
       User.findByPk(id).then(function (user) {
            if (!user) { done(null, false); }
            console.log('deserialize: ' + user.username)
           done(null, user);
        });
    }); 



