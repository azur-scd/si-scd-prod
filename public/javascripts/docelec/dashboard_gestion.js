$(function(){

  $("#selectYear").dxSelectBox({
    width: 150,
    dataSource: years,
    valueExpr: "cle",
    displayExpr: "valeur",
    value: 2021,
    onValueChanged: function(data) {
       return dataDisplay(data.value,$("#selectStep").dxSelectBox('instance').option('value')),
         treeDiscDisplay(data.value,$("#selectStep").dxSelectBox('instance').option('value'))
    }
})

$("#selectStep").dxSelectBox({
  width: 150,
  dataSource: steps,
  valueExpr: "cle",
  displayExpr: "valeur",
  value: "exec",
  onValueChanged: function(data) {
     return dataDisplay($("#selectYear").dxSelectBox('instance').option('value'),data.value),
       treeDiscDisplay($("#selectYear").dxSelectBox('instance').option('value'),data.value)
  }
})

dataDisplay($("#selectYear").dxSelectBox('instance').option('value'),$("#selectStep").dxSelectBox('instance').option('value'));
treeDiscDisplay($("#selectYear").dxSelectBox('instance').option('value'),$("#selectStep").dxSelectBox('instance').option('value'));

function dataDisplay(year,step) {

  $("div[id^='general']").empty()
  $("div[id^='reliquat']").empty()
  $("#noData").empty()

  getItems(urlGestionCustom+"/?annee="+year).done(function(results){
      if(results.length == 0) {
        $("#noData").append("<div class='alert alert-danger' role='alert'><strong>Pas de données pour cette année</strong></div>")
      }
    //data general et par pole
    window["dataSCD"] = groupBy(results,"bdd_id")
   console.log(window["dataSCD"])
    window["dataSTM"] =  window["dataSCD"].filter(function(d){
      return d.pole == "STM"
    })

    window["dataSHS"] =  window["dataSCD"].filter(function(d){
      return d.pole == "SHS"
    })
    var seriesB = [
      //{ valueField: "1-prev", name: "Prévisionnel" },
      { valueField: "2-budgete", name: "Budgété" },
      { valueField: "3-estime", name: "Estimé" },
      { valueField: "4-facture", name: "Facturé" }
  ]
  var seriesP1 = [{ valueField: "1-prev-SCD", name: "Prévisionnel SCD" },
                 { valueField: "1-prev-STM", name: "Prévisionnel STM" },
                 { valueField: "1-prev-SHS", name: "Prévisionnel SHS" }]
				 
  var seriesP2 = [{ valueField: "1-prev", name: "Prévisionnel" }]			 

//data pour visus montants consolidés   
if (step == "exec") {
poleState.map(function(d){
window["storeMontant"+d.cle] = []  
window["storeMontant"+d.cle]
.push({"state":"Budget initial","2-budgete":budgetSuiviSumAndCount(window["data"+d.cle]).budgeteInitial},
      {"state":"Budget exécuté","2-budgete":budgetSuiviSumAndCount(window["data"+d.cle]).budgeteOnlySum,"3-estime":budgetSuiviSumAndCount(window["data"+d.cle]).estimeOnlySum,"4-facture":budgetSuiviSumAndCount(window["data"+d.cle]).factureOnlySum})              
$("#general"+d.cle).append("<div id='dxStackedBar"+d.cle+"' style='height: 340px;width: 340px;'></div>")
getStackedBar("dxStackedBar"+d.cle,window["storeMontant"+d.cle],"state",seriesB,`Suivi ${d.cle} (montants)`)
})   
}
else if (step == "prev") {
 window["storeMontantSCD"] = []  
  window["storeMontantSCD"]   
    .push({"state":"SCD","1-prev-SCD":budgetSuiviSumAndCount(window["dataSCD"]).prevInitial},
          {"state":"Poles","1-prev-STM":budgetSuiviSumAndCount(window["dataSTM"]).prevOnlySum,"1-prev-SHS":budgetSuiviSumAndCount(window["dataSHS"]).prevOnlySum})
		  console.log(window["storeMontantSCD"])
  $("#generalSCD").append("<div id='dxStackedBarSCD' style='height: 340px;width: 340px;'></div>")
  getStackedBar("dxStackedBarSCD",window["storeMontantSCD"],"state",seriesP1,`Prévisions SCD (montants TTC)`)        
}
//data pour visus comptage des ressources 
if (step == "exec") {
poleState.map(function(d){
window["storeCount"+d.cle] = []  
window["storeCount"+d.cle].push({"state":"Budgété","value":budgetSuiviSumAndCount(window["data"+d.cle]).budgeteOnlyCount},
                              {"state":"Estimé","value":budgetSuiviSumAndCount(window["data"+d.cle]).estimeOnlyCount},
                              {"state":"Facturé","value":budgetSuiviSumAndCount(window["data"+d.cle]).factureOnlyCount})              
$("#generalCount"+d.cle).append("<div id='dxPie"+d.cle+"' style='height: 340px;width: 340px;'></div>")
getPie("dxPie"+d.cle,window["storeCount"+d.cle],"state","value",`Suivi ${d.cle} (nb de ressources)`)
})                      
}
//data pour visus detail ressource par pole
if (step == "exec") {
poleState.filter(function(d){
return d.cle != "SCD"
})
.map(function(d){
$("#generalRes"+d.cle).append("<div id='dxGroupedBar"+d.cle+"' style='height: 440px;'></div>")
getGroupedBar("dxGroupedBar"+d.cle,_.sortBy(window["data"+d.cle], function(o) { return - o["2-budgete"]; }),"bdd",seriesB,`Détails par ressource ${d.cle}`) 
})
}
else if (step == "prev") {
poleState.filter(function(d){
  return d.cle != "SCD"
})
.map(function(d){
  $("#generalRes"+d.cle).append("<div id='dxGroupedBar"+d.cle+"' style='height: 440px;'></div>")
  getGroupedBar("dxGroupedBar"+d.cle,_.sortBy(window["data"+d.cle], function(o) { return - o["1-prev"]; }),"bdd",seriesP2,`Détails par ressource ${d.cle}`) 
})
}
//data pour visus reliquat
var storeReliquat = []
poleState.filter(function(d){
storeReliquat.push({"state":d.cle,"2-budgete":budgetSuiviSumAndCount(window["data"+d.cle]).budgeteOnlyReliquat,"3-estime":budgetSuiviSumAndCount(window["data"+d.cle]).estimeOnlyReliquat,"4-facture":budgetSuiviSumAndCount(window["data"+d.cle]).factureOnlyReliquat})
$("#reliquatTotal"+d.cle).append(Math.round(budgetSuiviSumAndCount(window["data"+d.cle]).totalReliquat).toLocaleString())
})

/*$("#reliquatStackedBar").append("<div id='dxReliquatStackedBar' style='height: 440px;'></div>")
getStackedBar("dxReliquatStackedBar",storeReliquat,"state",series,"Ventilation reliquat") */
poleState.filter(function(d){
return d.cle != "SCD"
})
.map(function(d){
window["tseries"+d.cle] = window["data"+d.cle].filter(function(d){
return d["3-estime"] || d["4-facture"]
})
.map(function(d){
if(d["3-estime"]){ return {"bdd":d.bdd,"reliquat-estime":d["reliquat"],"reliquat-facture":0}}
else if(d["4-facture"]) { return {"bdd":d.bdd,"reliquat-facture":d["reliquat"],"reliquat-estime":0}}
})
$("#reliquatRotatedBar"+d.cle).append("<div id='dxReliquatRotatedBar"+d.cle+"' style='height: 440px;'></div>")
getRotatedBar("dxReliquatRotatedBar"+d.cle,window["tseries"+d.cle] ,"bdd","reliquat-estime","Reliquat estimé","reliquat-facture","Reliquat facturé",`Reliquats par ressource ${d.cle}`)
  })

//data pour visus oa
poleState.filter(function(d){
window["oa"+d.cle] = window["data"+d.cle].filter(function(d){
  return d.soutien_oa == "oas" || d.soutien_oa == "oar"
})
})
  
})
} 

  function treeDiscDisplay(year,step) {
    getItems(urlBdd2Disc + "/amount/"+year).done(function(results){
      var filtered = results.filter(function(d){
        if (step == "prev") {
          return d.etat == "1-prev"
        }
        if (step == "exec") {
          return d.etat == "4-facture" || d.etat == "3-estime" || d.etat == "2-budgete"
        } 
      })
      var grouped = getGroupSum(filtered,"disc_id","montant_part")
  
  var storeDiscs = new DevExpress.data.CustomStore({
          key: "id",
          byKey: function (key) {  
              return $.get(urlDisc + "/" + key.toString());  
          },
          load: function () {
             return getItems(urlDisc).done(function(res){
                console.log(res.map(x => Object.assign(x, grouped.find(y => y.key == x.id))))
                  return res.map(x => Object.assign(x, grouped.find(y => y.key == x.id)));
             })
                     
           }      
      });
      $("#containerDisc").dxTreeList({
          dataSource: storeDiscs,
          rootValue: -1,
          keyExpr: "id",
          parentIdExpr: "parent_id",
          columns: [
              {
              dataField: "disc",
              caption: "Discipline",
          }, 
         /* {
              dataField: "parent_id",
              caption: "Discipline parente",
              lookup: {
                  dataSource: {
                      store: storeDiscs,
                      sort: "code"
                  },
                  valueExpr: "id",
                  displayExpr: "disc"
              }
          },*/
          {
              dataField: "value",
              caption: "Montant TTC",
              alignment: "left",
          }],
          expandedRowKeys: [1,2,3,4,5],
          showRowLines: true,
          showBorders: true,
          columnAutoWidth: true,
          scrolling: {
              mode: "standard"
          },
          paging: {
              pageSize: 100
          },
          pager: {
              showPageSizeSelector: true,
              allowedPageSizes: [10, 20, 50, 100],
              showInfo: true
          },
          "export": {
              enabled: true,
              fileName: "Budget_disciplines"
            },
            headerFilter: {
              visible: true
          },
          filterRow: {
              visible: true
          },
          filterPanel: { visible: true },
          searchPanel: {
              visible: true
          }
      });
      })
  }    
})