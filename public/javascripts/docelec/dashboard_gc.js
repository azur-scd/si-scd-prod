$(function(){

  $("#selectYear").dxSelectBox({
    width: 150,
    dataSource: years,
    valueExpr: "cle",
    displayExpr: "valeur",
    value:years[8].cle,
    onValueChanged: function(data) {
       // return $("#year").val(data.value)
       return bddDisplay(data.value,$("#selectStep").dxSelectBox('instance').option('value')),
       gcDisplay(data.value,$("#selectStep").dxSelectBox('instance').option('value'))
    }
})

$("#selectStep").dxSelectBox({
  width: 150,
  dataSource: steps,
  valueExpr: "cle",
  displayExpr: "valeur",
  value: "exec",
  onValueChanged: function(data) {
     // return $("#year").val(data.value)
     return bddDisplay($("#selectYear").dxSelectBox('instance').option('value'),data.value),
     gcDisplay($("#selectYear").dxSelectBox('instance').option('value'),data.value)
  }
})

bddDisplay($("#selectYear").dxSelectBox('instance').option('value'),$("#selectStep").dxSelectBox('instance').option('value'));
gcDisplay($("#selectYear").dxSelectBox('instance').option('value'),$("#selectStep").dxSelectBox('instance').option('value'))

function bddDisplay(year,step) {
  var f_gcs;

fetch(urlGC+"/?debut="+year)
.then(res => res.json())
.then(data => f_gcs = data)
.then(() => console.log(f_gcs))

    var storeFilteredBdd = new DevExpress.data.CustomStore({
      //loadMode: "raw",
      load: function () {
          var d = new $.Deferred();
          $.get(urlGestionGc+"?annee="+year+"&etat=1-prev").done(function(results){
            var data = results
            .filter(item => !f_gcs.includes(item["bdd_id"]))
            d.resolve(data)
         })
         return d.promise();
      }
  });
  $("#containerListBdd").dxDataGrid({
    dataSource: storeFilteredBdd,
    repaintChangesOnly: true,
    showBorders: true,
    columnAutoWidth: true,
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
        fileName: "BDD"
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
            dataField: "montant_ttc_avant_recup",
            caption: "Montant TTC avant récup",
            dataType: 'number'
        },
        {
            dataField: "montant_ttc",
            caption: "Montant TTC",
            dataType: 'number',
        },
        {
            dataField: "updatedAt",
            caption: "Mise à jour le",
            dataType: "date"
        }
    ]
})

}     

function gcDisplay(year) {
  var storeFilteredGc = new DevExpress.data.CustomStore({
    //loadMode: "raw",
    load: function () {
        var d = new $.Deferred();
        $.get(urlGC+"?debut="+year).done(function(results){
          //var data = results
          d.resolve(results)
       })
       return d.promise();
    }
});

$("#containerListGc").dxDataGrid({
  dataSource: storeFilteredGc,
  repaintChangesOnly: true,
  showBorders: true,
  columnAutoWidth: true,
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
      fileName: "GC"
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
  columns: [
      {
      dataField: "nom",
      caption: "GC",
      width: 125
      },
      {
          dataField: "debut",
          caption: "Début"
      },
      {
          dataField: "fin",
          caption: "Fin"
      },
      {
          dataField: "montant_ttc",
          caption: "Montant TTC",
          dataType: 'number',
      },
      {
          dataField: "updatedAt",
          caption: "Mise à jour le",
          dataType: "date"
      }
  ]
 })
}
})