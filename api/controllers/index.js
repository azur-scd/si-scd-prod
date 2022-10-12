const bu = require("./bu");
const horaires = require("./horaires");
const user = require("./user");
const bdd = require("./bdd");
const bddSignalement = require("./bddSignalement");
const bddGestion = require("./bddGestion");
const bddStat = require("./bddStat");
const gc = require("./gc");
const statReport = require("./statReport");
const statSuivi = require("./statSuivi");
const disc = require("./disc");
const bddDiscipline = require("./bddDiscipline");
const sushiHarvest = require("./sushiHarvest")
module.exports = {bu,
                  horaires,
                  user,
                  bdd,
                  bddSignalement,
                  bddGestion,
                  bddStat,
                  gc,
                  statReport,
				  statSuivi,
                  disc,
				  bddDiscipline,
				  sushiHarvest};