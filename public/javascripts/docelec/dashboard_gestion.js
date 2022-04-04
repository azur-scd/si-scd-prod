$(function () {

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
 
$("#selectYear").dxSelectBox({
  width: 150,
  dataSource: years,
  valueExpr: "cle",
  displayExpr: "valeur",
  value: years[8].cle,
  onValueChanged: function (data) {
    $("div[id^='widget']").empty()
    $("div[id^='abstract']").empty()
    poleState.map(function(d){return $("#abstract"+d.cle).empty()})
    dataDatagrid(data.value)
    getWidgetsData(data.value).done(function(results){displayWidgets(results,$("#selectStep").dxSelectBox('instance').option('value')) })
  }
})

$("#selectStep").dxSelectBox({
  width: 150,
  dataSource: steps,
  valueExpr: "cle",
  displayExpr: "valeur",
  value: "exec",
  onValueChanged: function (item) {
    $("div[id^='widget']").empty()
    getWidgetsData($("#selectYear").dxSelectBox('instance').option('value')).done(function(results){displayWidgets(results,item.value) })
  }
})

dataDatagrid($("#selectYear").dxSelectBox('instance').option('value'))
getWidgetsData($("#selectYear").dxSelectBox('instance').option('value')).done(function(results){displayWidgets(results,$("#selectStep").dxSelectBox('instance').option('value')) })

function calculateStatistics(pole) {
  $("#abstract"+pole).empty()
  $('#generalResGrid'+pole).dxDataGrid("instance").getSelectedRowsData().then((rowData) => {
    $("#abstract"+pole).append("<div class='col-md-2'><a href='#' class='tile tile-default'><p>Nombre de ressources selectionnées</p>"+rowData.length+"</a></div>")
    etatState.map(function(d){
      this[d.cle+'_total'] = 0
      for (let s of rowData) {
        if(s[d.cle] === undefined) {s[d.cle] = 0}
        this[d.cle+'_total'] += s[d.cle];
      }
      $("#abstract"+pole).append("<div class='col-md-2'><a href='#' class='tile tile-info'><p>Total "+d.valeur+"</p>"+Math.round(this[d.cle+'_total'] || 0)+"</a></div>")
     })
     this['reliquat_total'] = 0
   for (let s of srowData) {
    if(s["reliquat"] === undefined) {s["reliquat"] = 0}
    this['reliquat_total'] += s["reliquat"];
  }
  $("#abstract"+pole).append("<div class='col-md-2'><a href='#' class='tile tile-danger'><p>Total Reliquats</p>"+Math.round(this['reliquat_total'] || 0)+"</a></div>") 
  })
}
  //main data
  function dataDatagrid(year) {
    var store = new DevExpress.data.CustomStore({
      //loadMode: "raw",
      key: "bdd_id",
      load: function () {
        var d = new $.Deferred();
        getItems(urlGestionCustom + "/?annee=" + year).done(function(results){
          let data ;
        if (results.length == 0) {
          $("#noData").append("<div class='alert alert-danger' role='alert'><strong>Pas de données pour cette année</strong></div>")
        }
        data = groupBy(results, "bdd_id")
        d.resolve(data)
       })
       return d.promise();
    }
    });

    poleState.map(function(d) {
      $('#generalResGrid' + d.cle).dxDataGrid({
        dataSource: store,
        keyExpr: 'bdd_id',
        repaintChangesOnly: true,
        showBorders: true,
        columnMinWidth: 50,
        columnMaxWidth: 125,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        allowColumnReordering: true,
        paging: {
          pageSize: 10
        },
        pager: {
          showPageSizeSelector: true,
          allowedPageSizes: [5, 10, 20, 50, 100],
          showInfo: true
        },
        "export": {
          enabled: true,
          fileName: "suivi_budget_ressources"
        },
        headerFilter: {
          visible: true
        },
        filterRow: {
          visible: true,
          applyFilter: "auto"
        },
        filterPanel: { visible: true },
        searchPanel: {
          visible: true
        },
        filterValue: ["pole", "=", d.cle],
        columnChooser: {
          enabled: true,
          mode: "select"
        },
        selection: {
          mode: 'multiple',
          selectAllMode: 'allPages',
          showCheckBoxesMode: 'onClick',
          deferred: true,
        },
        onSelectionChanged(e) {
          calculateStatistics(d.cle);
          e.component.refresh(true);
        },
        selectedRowKeys: [],
        columns: [
  
          {
            dataField: "bdd",
            caption: "Ressource",
            dataType: 'string',
            width: 150
          },
          {
            dataField: "pole",
            caption: "Pole",
            dataType: 'string',
            visible: false
          },
          {
            dataField: "1-prev",
            caption: "Prévisionnel",
            dataType: 'number',
            alignment: 'left',
            width: 100
          },
          {
            dataField: "2-budgete",
            caption: "Budgete",
            dataType: 'number',
            alignment: 'left',
            width: 100
          },
          {
            dataField: "3-estime",
            caption: "Estimé",
            dataType: 'number',
            alignment: 'left',
            width: 100
          },
          {
            dataField: "4-facture",
            caption: "Facturé",
            dataType: 'number',
            alignment: 'left',
            width: 100
          },
          {
            dataField: "reliquat",
            caption: "Reliquat",
            dataType: 'number',
            alignment: 'left',
            width: 100
          },
          {
            caption: 'Dynamics',
            minWidth: 200,
            cellTemplate(container, options) {
              let sparkLineStore = object2array(options.data).filter(item => ["1-prev", "2-budgete", "3-estime", "4-facture"].includes(item.key))
              container.addClass('chart-cell');
              $('<div />').dxSparkline({
                dataSource: sparkLineStore,
                argumentField: 'key',
                valueField: 'value',
                type: 'line',
                showMinMax: true,
                minColor: '#f00',
                maxColor: '#2ab71b',
                pointSize: 6,
                size: {
                  width: 180,
                  height: 40,
                },
                tooltip: {
                  enabled: false,
                },
              }).appendTo(container);
            }
          }
        ],
      })

    })
  }
  function getWidgetsData(year) {   
    var d = new $.Deferred();
    $.get(urlGestionCustom + "/?annee=" + year).done(function (results) {
      let data= {}
      if (results.length == 0) {
        $("#noData").append("<div class='alert alert-danger' role='alert'><strong>Pas de données pour cette année</strong></div>")
      }
      //data general et par pole
      data["dataSCD"] = groupBy(results, "bdd_id")
      data["dataSTM"] = data["dataSCD"].filter(function (d) {
        return d.pole == "STM"
      })
      data["dataSHS"] = data["dataSCD"].filter(function (d) {
        return d.pole == "SHS"
      })
      d.resolve(data)
    })
    return d.promise();
  }

  function displayWidgets(data,step) {

    switch (step) {
      case 'exec':
        //data pour visus montants consolidés (barchart)
        globalMontantScdPoles(data,seriesB)
        //data pour visus comptage des ressources 
        globalCountScdPoles(data,)
        // data détail par ressource (barchart)
        detailPolesChart(data,seriesB, "2-budgete")
        //Reliquats
        reliquatsPoles(data)
        break;
      case 'prev':
        data["storeMontantSCD"] = []
        data["storeMontantSCD"]
          .push({ "state": "SCD", "1-prev-SCD": budgetSuiviSumAndCount(data["dataSCD"]).prevInitial },
            { "state": "Poles", "1-prev-STM": budgetSuiviSumAndCount(data["dataSTM"]).prevOnlySum, "1-prev-SHS": budgetSuiviSumAndCount(data["dataSHS"]).prevOnlySum })
        $("#widgetCostSCD").append("<div id='dxStackedBarSCD' style='height: 340px;width: 340px;'></div>")
        getStackedBar("dxStackedBarSCD", data["storeMontantSCD"], "state", seriesP1, `Prévisions SCD (montants TTC)`)
        // data détail par ressource (barchart)
        detailPolesChart(data,seriesP2,"1-prev")
        break;
    }
      /*data pour visus oa
      poleState.filter(function (d) {
        window["oa" + d.cle] = window["data" + d.cle].filter(function (d) {
          return d.soutien_oa == "oas" || d.soutien_oa == "oar"
        })
      })*/
  }

  function globalMontantScdPoles(data,series) {
    poleState.map(function (d) {
      data["storeMontant" + d.cle] = []
      data["storeMontant" + d.cle]
        .push({ "state": "Budget initial", "2-budgete": budgetSuiviSumAndCount(data["data" + d.cle]).budgeteInitial },
          { "state": "Budget exécuté", "2-budgete": budgetSuiviSumAndCount(data["data" + d.cle]).budgeteOnlySum, "3-estime": budgetSuiviSumAndCount(data["data" + d.cle]).estimeOnlySum, "4-facture": budgetSuiviSumAndCount(data["data" + d.cle]).factureOnlySum })
      $("#widgetCost" + d.cle).append("<div id='dxStackedBar" + d.cle + "' style='height: 340px;width: 340px;'></div>")
      getStackedBar("dxStackedBar" + d.cle, data["storeMontant" + d.cle], "state", series, `Suivi ${d.cle} (montants)`)
    })
  }

  function globalCountScdPoles(data) {
    poleState.map(function (d) {
      data["storeCount" + d.cle] = []
      data["storeCount" + d.cle].push({ "state": "Budgété", "value": budgetSuiviSumAndCount(data["data" + d.cle]).budgeteOnlyCount },
        { "state": "Estimé", "value": budgetSuiviSumAndCount(data["data" + d.cle]).estimeOnlyCount },
        { "state": "Facturé", "value": budgetSuiviSumAndCount(data["data" + d.cle]).factureOnlyCount })
      $("#widgetCount" + d.cle).append("<div id='dxPie" + d.cle + "' style='height: 340px;width: 340px;'></div>")
      getPie("dxPie" + d.cle, data["storeCount" + d.cle], "state", "value", `Suivi ${d.cle} (nb de ressources)`)
    })
  }

  function detailPolesChart(data,series, etat) {
    poleState.filter(function (d) {
      return d.cle != "SCD"
    })
      .map(function (d) {
        $("#generalResChart" + d.cle).append("<div id='dxGroupedBar" + d.cle + "' style='height: 440px;'></div>")
        //getGroupedBar("dxGroupedBar"+d.cle,window["data"+d.cle],"bdd",seriesB,`Détails par ressource ${d.cle}`) 
        getGroupedBar("dxGroupedBar" + d.cle, _.sortBy(data["data" + d.cle], function (o) { return - o[etat]; }), "bdd", series, `Détails par ressource ${d.cle}`)
      })
  }

  function reliquatsPoles(data) {
    poleState.filter(function (d) {
      return d.cle != "SCD"
    })
      .map(function (d1) {
        data["tseries" + d1.cle] = data["data" + d1.cle].filter(function (d2) {
          return d2["3-estime"] || d2["4-facture"]
        })
      .map(function (d3) {
        if (d3["3-estime"]) { return { "bdd": d3.bdd, "reliquat-estime": d3["reliquat"], "reliquat-facture": 0 } }
        else if (d3["4-facture"]) { return { "bdd": d3.bdd, "reliquat-facture": d3["reliquat"], "reliquat-estime": 0 } }
          })
        getRotatedBar("dxReliquatRotatedBar" + d3.cle, data["tseries" + d3.cle], "bdd", "reliquat-estime", "Reliquat estimé", "reliquat-facture", "Reliquat facturé", `Reliquats par ressource ${d3.cle}`)
      })
  }
})