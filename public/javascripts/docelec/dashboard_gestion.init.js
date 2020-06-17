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
    getItems(urlGestionCustom+"/?annee="+$("#year").val()).done(function(results){
      //data for visus par bdd
      var data = groupBy(results,"bdd_id")
      console.log(data)
      //getPyramid("barSCD",data)
     getPie("pieSCD","bdd",data)
      //data pour visus montants consolidés
      var dataSTM = data.filter(function(d){
        return d.pole == "STM"
      })
      var dataSHS = data.filter(function(d){
        return d.pole == "SHS"
      })
      var arraySuiviMontantSCD = []
      var arraySuiviMontantSTM = []
      var arraySuiviMontantSHS = []
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
arraySuiviMontantSCD.push({"state":"Budget initial","budgete":getMontant(data).totalBudgetInitial},
                             {"state":"Budget exécuté","budgete":getMontant(data).totalBudgeteOnly,"estime":getMontant(data).totalEstimeOnly,"facture":getMontant(data).totalFactureOnly})
arraySuiviMontantSTM.push({"state":"Budget initial","budgete":getMontant(dataSTM).totalBudgetInitial},
                             {"state":"Budget exécuté","budgete":getMontant(dataSTM).totalBudgeteOnly,"estime":getMontant(dataSTM).totalEstimeOnly,"facture":getMontant(dataSTM).totalFactureOnly})                             
arraySuiviMontantSHS.push({"state":"Budget initial","budgete":getMontant(dataSHS).totalBudgetInitial},
                             {"state":"Budget exécuté","budgete":getMontant(dataSHS).totalBudgeteOnly,"estime":getMontant(dataSHS).totalEstimeOnly,"facture":getMontant(dataSHS).totalFactureOnly})                             
getClusteredBar("barMontantSCD",arraySuiviMontantSCD,"Suivi SCD") 
getClusteredBar("barMontantSTM",arraySuiviMontantSTM,"Suivi STM")                             
getClusteredBar("barMontantSHS",arraySuiviMontantSHS,"Suivi SHS")

    })
    var series = [
      { valueField: "2-budgete", name: "Budgété" },
      { valueField: "3-estime", name: "Estimé" },
      { valueField: "4-facture", name: "Facturé" }
  ]
  
  })
   
})