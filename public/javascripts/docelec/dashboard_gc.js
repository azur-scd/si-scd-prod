$(function () {

  $("#selectYear").dxSelectBox({
    width: 150,
    dataSource: years,
    valueExpr: "cle",
    displayExpr: "valeur",
    value: years[7].cle,
    onValueChanged: function (data) {
      // return $("#year").val(data.value)
      return bddDisplay(data.value, $("#selectStep").dxSelectBox('instance').option('value')),
        gcDisplay(data.value, $("#selectStep").dxSelectBox('instance').option('value'))
    }
  })

  $("#selectStep").dxSelectBox({
    width: 150,
    dataSource: steps,
    valueExpr: "cle",
    displayExpr: "valeur",
    value: "exec",
    onValueChanged: function (data) {
      // return $("#year").val(data.value)
      return bddDisplay($("#selectYear").dxSelectBox('instance').option('value'), data.value),
        gcDisplay($("#selectYear").dxSelectBox('instance').option('value'), data.value)
    }
  })

  bddDisplay($("#selectYear").dxSelectBox('instance').option('value'), $("#selectStep").dxSelectBox('instance').option('value'));
  gcDisplay($("#selectYear").dxSelectBox('instance').option('value'), $("#selectStep").dxSelectBox('instance').option('value'))

 function annualSuiviChartDisplay() {
    $("#containerListBdd").dxDataGrid("instance").getSelectedRowsData().then((rowData) => {
      if (rowData.length != 0) {
        getSimpleBar("annualSuivi", rowData, "bdd", "montant_ttc", "etat", "Montant TTC par ressource")
        }
    })
  }

  function poleSuiviChartDisplay() {
    $("#containerListBdd").dxDataGrid("instance").getSelectedRowsData().then((rowData) => {
      if (rowData.length != 0) {
        var aggData = getGroupSum(rowData, "pole", "montant_ttc")
        getPie("poleSuivi", aggData, "key", "value", "Montants TTC agrégés par pôle")
        }
    })
  }

  function calculateBddStatistics(){
    $("#widgetBdd").empty()
    $('#containerListBdd').dxDataGrid("instance").getSelectedRowsData().then((rowData) => {
      var ttc_total = 0
      for (let s of rowData) {
        ttc_total += s["montant_ttc"];
      }
      var ttc_avant_recup_total = 0
      for (let s of rowData) {
        ttc_avant_recup_total += s["montant_ttc_avant_recup"];
      }
      $("#widgetBdd").append("<div class='col-md-3'><a href='#' class='tile tile-info'><p>Total TTC</p>"+Math.round(ttc_total || 0)+"</a></div><div class='col-md-3'><a href='#' class='tile tile-info'><p>Total TTC avant récup</p>"+Math.round(ttc_avant_recup_total || 0)+"</a></div>")
    })
  }
  
    function calculateGcStatistics(){
    $("#widgetGc").empty()
    $('#containerListGc').dxDataGrid("instance").getSelectedRowsData().then((rowData) => {
      var ttc_total = 0
      for (let s of rowData) {
        ttc_total += s["montant_ttc"];
      }
      $("#widgetGc").append("<div class='col-md-3'><a href='#' class='tile tile-info'><p>Total TTC</p>"+Math.round(ttc_total || 0)+"</a></div>")
    })
  }

  function bddDisplay(year, step) {
    var storeBdd = new DevExpress.data.CustomStore({
      loadMode: "raw",
      key: "id",
      load: function () {
        var d = new $.Deferred();
        $.get(urlGestionGc + "?annee=" + year).done(function (results) {
          let data;
          if (step == "prev") {
            data = results.filter(function (d) { return d.etat == "1-prev" })
          }
          else {
              var groupResults = (_.groupBy(results,"bdd_id"))
			  //console.log(groupResults)
            var arr = []
            for (let key in groupResults) {
              if (groupResults[key].some(item => item.etat === '4-facture')) {
                arr.push(groupResults[key].filter(function (du) { return du.etat == "4-facture" })[0])            
              }
              else if (!groupResults[key].some(item => item.etat === '4-facture') && groupResults[key].some(item => item.etat === '3-estime')) {
                arr.push(groupResults[key].filter(function (du) { return du.etat == "3-estime" })[0])            
              }
              else {
                arr.push(groupResults[key].filter(function (du) { return du.etat == "2-budgete" })[0])
              }
            }
            data = arr.filter(function(elt){
      return elt != null;
     })
          }
          d.resolve(data)
        })
        return d.promise();
      }
    });
    $("#containerListBdd").dxDataGrid({
      dataSource: storeBdd,
      keyExpr: 'id',
      repaintChangesOnly: true,
      showBorders: true,
      rowAlternationEnabled: true,
      allowColumnReordering: true,
      columnMinWidth: 50,
      columnMaxWidth: 125,
      columnAutoWidth: true,
      columnHidingEnabled: true,
      columnChooser: {
        enabled: true,
        mode: "select"
      },
      scrolling: {
        useNative: false,
        scrollByContent: true,
        scrollByThumb: true,
        showScrollbar: "onHover" // or "onScroll" | "always" | "never"
      },
      sorting: {
        mode: "multiple"
      },
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
        fileName: "suivi_budget_annuel"
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
        selection: {
        mode: 'multiple',
        selectAllMode: 'allPages',
        showCheckBoxesMode: 'onClick',
        deferred: true,
      },
      onSelectionChanged(e) {
        e.component.refresh(true);
		calculateBddStatistics();
        annualSuiviChartDisplay();
        poleSuiviChartDisplay();
      },
      columns: [
        {
          dataField: "pole",
          caption: "Pôle"
        },
        {
          dataField: "bdd",
          caption: "Ressource",
          width: 125
        },
        {
          dataField: "etat",
          caption: "Dernier montant à jour",
        },
        {
          dataField: "montant_ttc_avant_recup",
          caption: "Montant TTC",
          dataType: 'number',
          alignment: 'left'
        },
        {
          dataField: "montant_ttc",
          caption: "Montant TTC avec récup",
          dataType: 'number',
          alignment: 'left'
        },
        {
          dataField: "debut_gc",
          caption: "Début du GC en cours"
        },
        {
          dataField: "fin_gc",
          caption: "Fin du GC en cours",
        },
        {
          dataField: "updatedAt",
          caption: "Mise à jour le",
          dataType: "date",
          visible: false
        }
      ],
      /*onInitialized: function (e) {
        e.component.selectAll();
      },*/
    })

  }

  function gcDisplay(year) {
    var storeFilteredGc = new DevExpress.data.CustomStore({
      loadMode: "raw",
      key: "id",
      load: function () {
        var d = new $.Deferred();
        $.get(urlGC + "?debut=" + year).done(function (results) {
          d.resolve(results)
        })
        return d.promise();
      }
    });

    $("#containerListGc").dxDataGrid({
      dataSource: storeFilteredGc,
      keyExpr: 'id',
      repaintChangesOnly: true,
      showBorders: true,
      columnMinWidth: 50,
      columnMaxWidth: 125,
      rowAlternationEnabled: true,
      allowColumnResizing: true,
      allowColumnReordering: true,
      paging: {
        pageSize: 50
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [5, 10, 20, 50, 100],
        showInfo: true
      },
      "export": {
        enabled: true,
        fileName: "suivi_gc"
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
        e.component.refresh(true);
		calculateGcStatistics()
      },
      columns: [
        {
          dataField: "nom",
          caption: "GC",
        },
        {
          dataField: "debut",
          caption: "Début",
        },
        {
          dataField: "fin",
          caption: "Fin",
        },
        {
          dataField: "montant_ttc",
          caption: "Montant TTC",
          dataType: 'number',
          alignment: 'left'
        },
        {
          dataField: "updatedAt",
          caption: "Mise à jour le",
          dataType: "date",
          visible: false
        }
      ],
      /* onInitialized: function(e) {  
         e.component.selectAll();  
       } ,*/
    })
  }
})