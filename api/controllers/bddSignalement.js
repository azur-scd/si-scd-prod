const BddSignalement = require("../models").BddSignalement;
const Bdd = require("../models").Bdd;
var fs = require('fs');
var busboy = require('connect-busboy');
var o2x = require('object-to-xml');

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
 
 exports.create = function(req, res) {
  BddSignalement.create(req.body).then( (result) => res.json(result) )
};

exports.delete = function(req, res) {
  BddSignalement.destroy({
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

//join pour gestion
exports.listForSignalement = function (req, res) {
  var q;
  if (req.query) {
    q = {
      where: req.query, include: [{
        model: Bdd,
        attributes: ['id', 'bdd'],
        where: {
          signalement: 1
        }
      }]
    }
  }
  else {
    q = {
      include: [{
        model: Bdd,
        attributes: ['id', 'bdd'],
        where: {
          signalement: 1
        }
      }]
    }
  }
  BddSignalement.findAll(
    q
  ).then(rows => {
    //res.json(rows)
    const resObj = rows.map(row => {
      return {
        "id": row.id,
        "bdd_id": row.bdd_id,
        "bdd": row.Bdd.bdd,
        "nom_court": row.nom_court,
        "source": row.source,
        "editeur": row.editeur,
        "url": row.url,
        "proxified_url": row.proxified_url,
        "disc": row.disc,
        "langue": row.langue,
        "type_contenu": row.type_contenu,
        "type_base": row.type_base,
        "type_acces": row.type_acces,
        "note_acces": row.note_acces,
        "description": row.description,
        "tuto": row.tuto,
        "icone": row.icone,
        "new": row.new,
        "alltitles": row.alltitles,
        "uca": row.uca,
        "commentaire": row.commentaire,
        "createdAt": row.createdAt,
        "updatedAt": row.updatedAt
      }
    });
    res.json(resObj)
  })
};

//join pour signalement
exports.listForSignalement = function (req, res) {
  var q;
  if (req.query) {
    q = {
      where: req.query, include: [{
        model: Bdd,
        attributes: ['id', 'bdd'],
        where: {
          signalement: 1
        }
      }]
    }
  }
  else {
    q = {
      include: [{
        model: Bdd,
        attributes: ['id', 'bdd'],
        where: {
          signalement: 1
        }
      }]
    }
  }
  BddSignalement.findAll(
    q
  ).then(rows => {
    //res.json(rows)
    const resObj = rows.map(row => {
      return {
        "id": row.id,
        "bdd_id": row.bdd_id,
        "bdd": row.Bdd.bdd,
        "nom_court": row.nom_court,
        "source": row.source,
        "editeur": row.editeur,
        "url": row.url,
        "proxified_url": row.proxified_url,
        "disc": row.disc,
        "langue": row.langue,
        "type_contenu": row.type_contenu,
        "type_base": row.type_base,
        "type_acces": row.type_acces,
        "note_acces": row.note_acces,
        "description": row.description,
        "tuto": row.tuto,
        "icone": row.icone,
        "new": row.new,
        "alltitles": row.alltitles,
        "uca": row.uca,
        "commentaire": row.commentaire,
        "createdAt": row.createdAt,
        "updatedAt": row.updatedAt
      }
    });
    res.json(resObj)
  })
};

exports.listForPrimo = function (req, res) {
  BddSignalement.findAll(
    {
      include: [{
        model: Bdd,
        attributes: ['id', 'bdd'],
        where: {
          signalement: 1
        }
      }]
    }
  ).then(rows => {
    //res.json(rows)
    const Resource =   
      rows.map(row => {
      return {
        LinkId : row.Bdd.id,
        ResourceId: row.Bdd.id,
        Title: row.Bdd.bdd,
        ShortTitle: row.nom_court,
        TitleSort: row.nom_court,
        Source: row.source,
				ProxiedURL: row.proxified_url,
				Publisher: row.editeur,
				Type: "plateforme",
				SubjectName: row.disc,
				Language: row.langue,
				ContentType: row.type_contenu,
				AccessType: row.type_acces,
				AccessNote: row.note_acces,
				BaseType: row.type_base,
				Note: row.description,
				Tutorial: row.tuto,
				Display: "Y",
				Icone: row.icone,
				allTitles: row.alltitles
            }          
    })
   /* var obj = { 
      '?xml version=\"1.0\" encoding=\"UTF-8\"?' : null,
      Resources : {
        '#' : {
         Resource
        }
      }
    };
  
   // res.setHeader('Content-disposition', 'attachment; filename= myFile.xml');
    //res.setHeader('Content-type', 'text/xml');
    res.set('Content-Type', 'text/xml; charset=utf-8');
    res.send(o2x(obj))*/
    res.send(Resource)
  })
}