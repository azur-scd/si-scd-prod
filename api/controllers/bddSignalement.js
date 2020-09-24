const BddSignalement = require("../models").BddSignalement;
var fs = require('fs');
var busboy = require('connect-busboy');

//simple
exports.list = function(req, res) {
  if(req.query){
    BddSignalement.findAll({where : req.query}).then(rows => {
      res.json(rows)
    })
  }
  else {
    BddSignalement.findAll().then(rows => {
        res.json(rows)
      })
    }
};

exports.findById = function(req, res) {
    BddSignalement.findByPk(req.params.id).then(rows => {
        res.json(rows)
      })
 };   

 exports.findByBddId = function(req, res) {
  BddSignalement.findAll({
    where: {
      bdd_id: req.params.bddId
    }
  }).then( (result) => res.json(result) )
};   

 exports.update = function(req, res) {
    BddSignalement.update(req.body, {
        where: {
            id: req.params.id
        }
      }).then( (result) => res.json(result) )
 }; 
 
  exports.import = function(req, res) {
  var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 
        //fstream = fs.createWriteStream(__dirname + '/uploads/' + filename);
        fstream = fs.createWriteStream('./uploads/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            res.redirect('back');
        });
    });
}; 

exports.read = function(req, res) {
  fs.readdir('./uploads/', function (err, files) {
    var arr = []
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
     arr.push({"file":file}) 
  });
  res.json(arr)
})
};