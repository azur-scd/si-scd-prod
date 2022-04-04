$(function () {

  $("#selectYear").dxSelectBox({
    width: 150,
    dataSource: years,
    valueExpr: "cle",
    displayExpr: "valeur",
    value: years[9].cle,
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
  annualSuiviChartDisplay()
  poleSuiviChartDisplay()

  function annualSuiviChartDisplay() {
    var data = $("#containerListBdd").dxDataGrid("instance").getSelectedRowsData()
    console.log(data)
    getSimpleBar("annualSuivi", data, "bdd", "montant_ttc", "etat", "Montant TTC par ressource")
  }

  function poleSuiviChartDisplay() {
    var data = $("#containerListBdd").dxDataGrid("instance").getSelectedRowsData()
	console.log(data)
    var aggData = getGroupSum(data, "pole", "montant_ttc")
    console.log(aggData)
    getPie("poleSuivi", aggData, "key", "value", "Montants TTC agrégés par pôle")
  }

  function bddDisplay(year, step) {
    var storeBdd = new DevExpress.data.CustomStore({
      //loadMode: "raw",
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
        allowSelectAll: true
      },
      onSelectionChanged(e) {
        e.component.refresh(true);
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
          caption: "Montant TTC avant récup",
          dataType: 'number',
          alignment: 'left'
        },
        {
          dataField: "montant_ttc",
          caption: "Montant TTC",
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
      onInitialized: function (e) {
        e.component.selectAll();
      },
      summary: {
        recalculateWhileEditing: true,
        totalItems: [{
          name: 'SelectedRowsTotalTTC',
          column: 'montant_ttc',
          summaryType: 'custom',
          valueFormat: 'fixedPoint thousands',
          displayFormat: 'Total TTC : {0}'
        },
        {
          name: 'SelectedRowsTotalTTCSansRecup',
          column: 'montant_ttc_avant_recup',
          summaryType: 'custom',
          valueFormat: 'fixedPoint thousands',
          displayFormat: 'Total TTC avant récup : {0}'
        }
        ],
        calculateCustomSummary(options) {
          if (options.name === 'SelectedRowsTotalTTC') {
            if (options.summaryProcess === 'start' && options.component.getSelectedRowsData()) {
              options.totalValue = options.component.getSelectedRowsData().reduce(function (_this, val) {
                return _this + val.montant_ttc
              }, 0)
            }
            if (options.summaryProcess === 'calculate') {
              if (options.component.isRowSelected(options.value.id)) {
                options.totalValue -= options.montant_ttc;
              }
            }
          }
          if (options.name === 'SelectedRowsTotalTTCSansRecup') {
            if (options.summaryProcess === 'start' && options.component.getSelectedRowsData()) {
              options.totalValue = options.component.getSelectedRowsData().reduce(function (_this, val) {
                return _this + val.montant_ttc_avant_recup
              }, 0)
            }
            if (options.summaryProcess === 'calculate') {
              if (options.component.isRowSelected(options.value.id)) {
                options.totalValue -= options.montant_ttc_avant_recup;
              }
            }
          }
        },
      }
    })

  }

  function gcDisplay(year) {
    var storeFilteredGc = new DevExpress.data.CustomStore({
      //loadMode: "raw",
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
        allowSelectAll: true
      },
      onSelectionChanged(e) {
        e.component.refresh(true);
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
      summary: {
        recalculateWhileEditing: true,
        totalItems: [{
          name: 'SelectedRowsMontantTTC',
          column: 'montant_ttc',
          summaryType: 'custom',
          valueFormat: 'fixedPoint thousands',
          displayFormat: 'Total TTC : {0}'
        }
        ],
        calculateCustomSummary(options) {
          if (options.name === 'SelectedRowsMontantTTC') {
            if (options.summaryProcess === 'start') {
              /* options.totalValue = options.component.getSelectedRowsData().reduce(function(_this, val) {
                   return _this + val.montant_ttc
               }, 0)*/
              options.totalValue = 0
            }
            if (options.summaryProcess === 'calculate') {
              if (options.component.isRowSelected(options.value.id)) {
                options.totalValue += options.montant_ttc;
              }
            }
          }
        },
      }
    })
  }
})