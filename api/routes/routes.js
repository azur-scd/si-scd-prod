const buController = require("../controllers").bu;
const userController = require("../controllers").user;
const bddController = require("../controllers").bdd;
const statReportController = require("../controllers").statReport;
const bddSignalementController = require("../controllers").bddSignalement;
const bddGestionController = require("../controllers").bddGestion;
const bddStatController = require("../controllers").bddStat;
const gcController = require("../controllers").gc;
const discController = require("../controllers").disc;
const bddDisciplineController = require("../controllers").bddDiscipline;

/*IMPORTANT : penser à déclarer les exports de controller dans controllers/index.js */

 /* Si on zappe les controllers, ça donne
 const Bu = require("../models").Bu;
 app.route('/api/bus')
      .get(function(req, res,next) {
        Bu.findAll().then(rows => {
          res.json(rows)
        })
    });*/ 

module.exports = function(app) {
    //test tout va bien
    app.route('/api')
      .get(function(req, res,next) {
        res.json({ message: 'hooray! welcome to our api!' });   
    });

    /*----- BUS-----*/
  //get all
  app.route('/api/bus')
  .get(buController.list) 
//get by id  
 app.route('/api/bus/:buId')
  .get(buController.findById);
//create  
  app.route('/api/bus/create')
  .post(buController.create);
  //update
  app.route('/api/bus/:buId/update')
  .put(buController.update); 
  //delete
app.route('/api/bus/:buId/delete')
 .delete(buController.delete);

   /*----- USERS-----*/
  //get all
  app.route('/api/users')
  .get(userController.list) 
//get by id  
 app.route('/api/users/:userId')
  .get(userController.findById);
/*login : signin
app.route('/api/users/login')
  .post(userController.login);*/
//create
  app.route('/api/users/create')
  .post(userController.create);
  //update
  app.route('/api/users/:userId/update')
  .put(userController.update); 
  //delete
app.route('/api/users/:userId/delete')
 .delete(userController.delete); 

 /*----- DISCIPLINES-----*/
  //get all
  app.route('/api/discs')
  .get(discController.list) 
//get by id  
 app.route('/api/discs/:discId')
  .get(discController.findById);
//create
  app.route('/api/discs/create')
  .post(discController.create);
  //update
  app.route('/api/discs/:discId/update')
  .put(discController.update); 
  //delete
app.route('/api/discs/:discId/delete')
 .delete(discController.delete); 

    /*----- BDDS-----*/
  //get all
  app.route('/api/bdds')
  .get(bddController.list) 
//get by id  
 app.route('/api/bdds/:bddId')
  .get(bddController.findById);
//create  
  app.route('/api/bdds/create')
  .post(bddController.create);
  //update
  app.route('/api/bdds/:bddId/update')
  .put(bddController.update); 
  //delete
app.route('/api/bdds/:bddId/delete')
 .delete(bddController.delete);

 /*----- BDDS SIGNALEMENT-----*/
//get all
app.route('/api/signalement')
.get(bddSignalementController.list) 
//get by id  
app.route('/api/signalement/:id')
.get(bddSignalementController.findById);
//get by bdd id  
app.route('/api/signalement/bddid/:bddId')
.get(bddSignalementController.findByBddId);
//update
app.route('/api/signalement/:id/update')
.put(bddSignalementController.update);
app.route('/api/signalement_import')
.post(bddSignalementController.import);
app.route('/api/signalement_readdir')
.get(bddSignalementController.read);

 /*----- BDDS GESTION-----*/
 //get all
app.route('/api/gestion')
.get(bddGestionController.list) 
//join for list
 app.route('/api/gestion_custom')
 .get(bddGestionController.listForGestion);
//get by id  
app.route('/api/gestion/:id')
.get(bddGestionController.findById);
//get by bdd id  
app.route('/api/gestion/bddid/:bddId')
.get(bddGestionController.findByBddId);
//update
app.route('/api/gestion/:id/update')
.put(bddGestionController.update);
//create  
app.route('/api/gestion/create')
.post(bddGestionController.create);
 //delete
 app.route('/api/gestion/:id/delete')
 .delete(bddGestionController.delete);
 
 /*----- BDDS DISCIPLINE-----*/
 //get all
app.route('/api/bdd2disc')
.get(bddDisciplineController.list) 
//get by id  
app.route('/api/bdd2disc/:id')
.get(bddDisciplineController.findById);
//get by disc id  
app.route('/api/bdd2disc/discid/:discId')
.get(bddDisciplineController.findByDiscId);
//get by disc id + harvest bdd cost by year 
app.route('/api/bdd2disc/amount/:year')
.get(bddDisciplineController.findDiscWithBddCost);
//get by bdd id  
app.route('/api/bdd2disc/bddid/:bddId')
.get(bddDisciplineController.findByBddId);
//update
app.route('/api/bdd2disc/:id/update')
.put(bddDisciplineController.update);
//create  
app.route('/api/bdd2disc/create')
.post(bddDisciplineController.create);
 //delete
 app.route('/api/bdd2disc/:id/delete')
 .delete(bddDisciplineController.delete);

  /*----- GC-----*/
  //get all
  app.route('/api/gcs')
  .get(gcController.list) 
//get by id  
 app.route('/api/gcs/:gcId')
  .get(gcController.findById);
//create  
  app.route('/api/gcs/create')
  .post(gcController.create);
  //update
  app.route('/api/gcs/:gcId/update')
  .put(gcController.update); 
  //delete
app.route('/api/gcs/:gcId/delete')
 .delete(gcController.delete);
 

/*----- TYPES STATS REPORTS-----*/
app.route('/api/stats_reports')
  .get(statReportController.list) 
//get by id  
 app.route('/api/stats_reports/:statReportId')
  .get(statReportController.findById);
//create  
  app.route('/api/stats_reports/create')
  .post(statReportController.create);
  //update
  app.route('/api/stats_reports/:statReportId/update')
  .put(statReportController.update); 
  //delete
app.route('/api/stats_reports/:statReportId/delete')
 .delete(statReportController.delete);

 /*----- BDDS STATS -----*/
 //get all
app.route('/api/bdds_all_stats')
.get(bddStatController.list) 
//join for list
app.route('/api/bdds_stats')
.get(bddStatController.listForStat);
//get by id  
app.route('/api/bdds_stats/:id')
.get(bddStatController.findById);
//get by bdd id  
app.route('/api/bdds_stats/bddid/:bddId')
.get(bddStatController.findByBddId);
//update
app.route('/api/bdds_stats/:id/update')
.put(bddStatController.update);
//create  
app.route('/api/bdds_stats/create')
.post(bddStatController.create);
 //delete
 app.route('/api/bdds_stats/:id/delete')
 .delete(bddStatController.delete);

  }