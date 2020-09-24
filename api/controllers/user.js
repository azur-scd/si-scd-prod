const User = require("../models").User;
//const bcrypt = require('bcrypt');
const saltRounds = 10;

/*async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
 }
  
function validatePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
 }*/

exports.list = function(req, res) {
  if(req.query){
    User.findAll({where : req.query}).then(rows => {
      res.json(rows)
    })
  }
  else {
    User.findAll().then(rows => {
        res.json(rows)
      })
    }
  };

exports.findById = function(req, res) {
    User.findByPk(req.params.userId).then(rows => {
        res.json(rows)
      })
 };  
/*------ UNUSED -----
//create : signup
 exports.create = function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err,   hash) { 
   var newUser = {"username":req.body.username,"password":hash,"bu_id":req.body.bu_id,"role":req.body.role}
  User.create(newUser).then( (result) => {if (result) {
    //res.redirect('/');
    res.send('created');
    }})
  })
};
//login : signin
exports.login = function(req, res) {
  User.findOne({
    where: {
        username: req.body.username
           }
   }).then(function (user) {
   if (!user) {
      res.send('Incorrect username');
      //res.redirect('/login');
   }
   else {
    bcrypt.compare(req.body.password, user.password, function (err, result) {
            if (result == true) {
              res.send("connected")
                //res.redirect('/');
            } else {
             res.send('Incorrect password');
             //res.redirect('/login');
            }
          });
         }
  })
}
------- */

exports.create = function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err,   hash) { 
    var newUser = {"username":req.body.username,"password":hash,"bu_id":req.body.bu_id,"groupe":req.body.groupe}
   User.create(newUser).then((result) => res.json(result) )
   })
}; 

 exports.update = function(req, res) {
    User.update(req.body, {
        where: {
            id: req.params.userId
        }
      }).then( (result) => res.json(result) )
 }; 

 exports.delete = function(req, res) {
    User.destroy({
        where: {
          id: req.params.userId
        }
      }).then( (result) => res.json(result) )
 };