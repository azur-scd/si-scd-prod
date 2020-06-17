$(function(){

    $("#selectYear").dxSelectBox({
      width: 150,
      dataSource: years,
      valueExpr: "cle",
      displayExpr: "valeur",
      onValueChanged: function(data) {
          return $("#year").val(data.value)
      }
  })

  $("#submit_year").click(function(){
    $("div[id^='general']").empty()
    var storeSuiviMontantSCD = []
    var storeSuiviMontantSTM = []
    var storeSuiviMontantSHS = []
    var data = []; var dataSTM = []; var dataSHS = []
    getItems(urlGestionCustom+"/?annee="+$("#year").val()).done(function(results){
      //data general et par pole
      data = groupBy(results,"bdd_id")
      console.log(data)
      //getPyramid("barSCD",data)
    // getPie("pieSCD","bdd",data)
      dataSTM = data.filter(function(d){
        return d.pole == "STM"
      })
      dataSHS = data.filter(function(d){
        return d.pole == "SHS"
      })
      var series = [
        { valueField: "2-budgete", name: "Budgété" },
        { valueField: "3-estime", name: "Estimé" },
        { valueField: "4-facture", name: "Facturé" }
    ]
     //data pour visus montants consolidés    
storeSuiviMontantSCD.push({"state":"Budget initial","2-budgete":getMontant(data).totalBudgetInitial},
                             {"state":"Budget exécuté","2-budgete":getMontant(data).totalBudgeteOnly,"3-estime":getMontant(data).totalEstimeOnly,"4-facture":getMontant(data).totalFactureOnly})
storeSuiviMontantSTM.push({"state":"Budget initial","2-budgete":getMontant(dataSTM).totalBudgetInitial},
                             {"state":"Budget exécuté","2-budgete":getMontant(dataSTM).totalBudgeteOnly,"3-estime":getMontant(dataSTM).totalEstimeOnly,"4-facture":getMontant(dataSTM).totalFactureOnly})                             
storeSuiviMontantSHS.push({"state":"Budget initial","2-budgete":getMontant(dataSHS).totalBudgetInitial},
                             {"state":"Budget exécuté","2-budgete":getMontant(dataSHS).totalBudgeteOnly,"3-estime":getMontant(dataSHS).totalEstimeOnly,"4-facture":getMontant(dataSHS).totalFactureOnly})    
//general SCD   
$("#generalSCD").append("<div id='dxStackedBarSCD' style='height: 340px;width: 340px;'></div>")
getStackedBar("dxStackedBarSCD",storeSuiviMontantSCD,"state",series,"Suivi SCD")  
//general STM
$("#generalSTM").append("<div id='dxStackedBarSTM' style='height: 340px;width: 340px;'></div>")
getStackedBar("dxStackedBarSTM",storeSuiviMontantSTM,"state",series,"Suivi STM")                                                 
//general SHS
$("#generalSHS").append("<div id='dxStackedBarSHS' style='height: 340px;width: 340px;'></div>")
getStackedBar("dxStackedBarSHS",storeSuiviMontantSHS,"state",series,"Suivi SHS")
//detail ressources STM
$("#generalResSTM").append("<div id='dxGroupedBarSTM'></div>")
getGroupedBar("dxGroupedBarSTM",dataSTM,"bdd",series,"Détail par ressource STM")
//detail ressources SHS
$("#generalResSHS").append("<div id='dxGroupedBarSHS'></div>")
getGroupedBar("dxGroupedBarSHS",dataSHS,"bdd",series,"Détail par ressource SHS")

//data pour visus reliquat
var storeReliquat = []
storeReliquat.push({"state":"SCD","2-budgete":getReliquat(data).budgeteReliquat,"3-estime":getReliquat(data).estimeReliquat,"4-facture":getReliquat(data).factureReliquat},
                   {"state":"STM","2-budgete":getReliquat(dataSTM).budgeteReliquat,"3-estime":getReliquat(dataSTM).estimeReliquat,"4-facture":getReliquat(dataSTM).factureReliquat},
                   {"state":"SHS","2-budgete":getReliquat(dataSHS).budgeteReliquat,"3-estime":getReliquat(dataSHS).estimeReliquat,"4-facture":getReliquat(dataSHS).factureReliquat})
$("#totalReliquatSCD").append(getReliquat(data).totalReliquat)
$("#totalReliquatSTM").append(getReliquat(dataSTM).totalReliquat)
$("#totalReliquatSHS").append(getReliquat(dataSHS).totalReliquat)
$("#reliquatStackedBar").append("<div id='dxReliquatStackedBar'></div>")
getStackedBar("dxReliquatStackedBar",storeReliquat,"state",series,"Ventilation reliquat") 
    })
  })

  function getMontant(data){
    var totalBudgetInitial = data.reduce(
      (acc, v) => acc+ v["2-budgete"]
      , 0
  );
  var totalBudgeteOnly = data.filter(function(d){
    return !d["3-estime"] && !d["4-facture"]
  })
  .reduce(
    (acc, v) => acc+ v["2-budgete"]
    , 0
);
var totalEstimeOnly = data.filter(function(d){
  return d["3-estime"] && !d["4-facture"]
})
.reduce(
  (acc, v) => acc+ v["3-estime"]
  , 0
);
var totalFactureOnly = data.filter(function(d){
return !d["3-estime"] && d["4-facture"]
})
.reduce(
(acc, v) => acc+ v["4-facture"]
, 0
);
return {totalBudgetInitial,totalBudgeteOnly,totalEstimeOnly,totalFactureOnly}
    }   

function getReliquat(data){
  var totalReliquat = data.reduce(
    (acc, v) => acc+ v["reliquat"]
    , 0
);
var budgeteReliquat = data.filter(function(d){
  return !d["3-estime"] && !d["4-facture"]
})
.reduce(
  (acc, v) => acc+ v["reliquat"]
  , 0
);
var estimeReliquat = data.filter(function(d){
  return d["3-estime"] && !d["4-facture"]
})
.reduce(
  (acc, v) => acc+ v["reliquat"]
  , 0
);
var factureReliquat = data.filter(function(d){
  return !d["3-estime"] && d["4-facture"]
})
.reduce(
  (acc, v) => acc+ v["reliquat"]
  , 0
);
return {totalReliquat,budgeteReliquat,estimeReliquat,factureReliquat}  
}  
})