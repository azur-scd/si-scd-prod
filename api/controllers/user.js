const User = require("../models").User;
var bcryptjs = require('bcryptjs');
var salt = bcryptjs.genSaltSync(10);

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


exports.create = function(req, res) {
	 bcryptjs.genSalt(10, function(err, salt) {
    bcryptjs.hash(req.body.password, salt, function(err, hash) {
      var newUser = {"username":req.body.username,"password":hash,"bu_id":req.body.bu_id,"groupe":req.body.groupe}
      User.create(newUser).then((result) => res.json(result) )
    });
});
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