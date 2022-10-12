const Horaires = require("../models").Horaires;
const { Op } = require('sequelize')

exports.list = function(req, res) {
    if(req.query){
        Horaires.findAll({where : req.query}).then(rows => {
        res.json(rows)
      })
    }
    else {
      Horaires.findAll().then(rows => {
          res.json(rows)
        })
      }
    };
  
  exports.findById = function(req, res) {
    const current_date = new Date().toLocaleDateString("fr")
    console.log(current_date)
    Horaires.findByPk(req.params.id).then(rows => {
          res.json(rows)
        })
   };
   

   exports.findByBuId = function(req, res) {
    Horaires.findAll({
      where: {
        id_bu: req.params.buId
      }
    }).then( (result) => res.json(result) )
  };

  exports.list_for_lc = function(req, res) {
    let todayDate = new Date()
    let todayDateFormat = todayDate.toISOString().slice(0, 10);
    let oneWeekMoreDate = new Date(todayDate.setDate(todayDate.getDate() + 7));
    let oneWeekMoreDateFormat = oneWeekMoreDate.toISOString().slice(0, 10);
      Horaires.findAll(
        {
            where: {
              id_bu: 9,
              date_jour: {
                [Op.gte]: todayDateFormat,
                [Op.lte]: oneWeekMoreDateFormat,
              }

            },
            attributes: ['date_jour', 'start','end'],
          }
      ).then(rows => {
          res.json(rows)
        })

    };