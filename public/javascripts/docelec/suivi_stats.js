$(function () {
	
	let editMode = true;
    if ($('#usergroup').val() == "guest") {
      editMode = false
    }

    function batchLoad() {
        $.get(urlBdd).done(function(results){
            var data = results
                      .filter(function(d){
                          return d.stats_collecte[$("#selectYear").dxSelectBox('instance').option('value')] // on 'affiche que les ressources qui ont l'année selectionnée cochée en gestion (champ stats_collecte)
                      }) 
                      .map(function(d){return d.id})
            //data.map(function(d) {return console.log({"id":d,"annee":$("#selectYear").dxSelectBox('instance').option('value'),"etat":etatStatSaisie[0].cle})})
            data.map(function(d) {return createItems(urlStatsSuivi, {"bdd_id":d,"annee":$("#selectYear").dxSelectBox('instance').option('value'),"etat":etatStatSaisie[0].cle})})
            dataGrid.refresh();
                    })
    }

    var storeBdds = new DevExpress.data.CustomStore({  
        key: "id",
        loadMode: "raw",
        cacheRawData: false,
        load: function () {
            //return getItems(urlBdd + "?gestion=1")
            var d = new $.Deferred();
            $.get(urlBdd).done(function(results){
              var data = results
                        .filter(function(d){
                            return d.stats_collecte[$("#selectYear").dxSelectBox('instance').option('value')] // on 'affiche que les ressources qui ont l'année selectionnée cochée en gestion (champ stats_collecte)
                        }) 
                       
            d.resolve(data)
           })
           return d.promise();
        } 
      })  
      
      $("#selectYear").dxSelectBox({
        dataSource: years,
        value: years[9].cle,
        valueExpr: "cle",
        displayExpr: "valeur",
        onValueChanged: function (data) {
            dataGrid.refresh();
            dataGrid.clearFilter();
            dataGrid.filter(["annee", "=", data.value]);
        }
    });

    $("#newDataButton").dxButton({
        text: "Générer un nouveau tableau pour l'année sélectionnée",
        onClick: function () {
            batchLoad();
        }
    });

    var storeStatSuivi = new DevExpress.data.CustomStore({
        key: "id",
        load: function () {
            return getItems(urlStatsSuivi)
        },
        update: function (key, values) {
            return updateItems(urlStatsSuivi, key, values);
        },
        insert: function (values) {
            return createItems(urlStatsSuivi, values);
        },
        remove: function (key) {
            return deleteItems(urlStatsSuivi, key);
        }
    });

    var dataGrid =  $("#gridContainerSuiviStats").dxDataGrid({
        dataSource: storeStatSuivi,
        repaintChangesOnly: true,
        showBorders: true,
        columnAutoWidth: true,
        allowColumnResizing: true,
        allowColumnReordering: true,
        filterValue: ["annee", "=", $("#selectYear").dxSelectBox('instance').option('value')],
        paging: {
            pageSize: 50
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50, 100, 150],
            showInfo: true
        },
        "export": {
            enabled: true,
            fileName: "stats_suivi_"+$("#selectYear").dxSelectBox('instance').option('value')
        },
        groupPanel: {
            emptyPanelText: "Drag & Drop colonnes pour effectuer des regroupements",
            visible: true
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
        editing: {
            mode: 'form',
            allowUpdating: editMode,
            allowAdding: editMode,
            allowDeleting: editMode,
            useIcons: true,
          },
        columns: [
            {
                type: "buttons",
                caption: "Actions",
                buttons: ["edit","delete"]
            },
             {
                dataField: "bdd_id",
                caption: "Ressource",
                lookup:
                {
                    dataSource: storeBdds,
                    valueExpr: "id",
                    displayExpr: "bdd"
                }
            },
			 {
                dataField: "bdd_id",
                caption: "Conforme Counter",
                lookup:
                {
                    dataSource: storeBdds,
                    valueExpr: "id",
                    displayExpr: "stats_counter"
                },
                allowEditing: false
            },
            {
                dataField: "bdd_id",
                caption: "Modalité de collecte",
                lookup:
                {
                    dataSource: storeBdds,
                    valueExpr: "id",
                    displayExpr: "stats_get_mode"
                },
                allowEditing: false
            },
            {
                dataField: "annee",
                caption: "Année",
                editorOptions: {  
                    step: 0  
                },
            },
            {
                dataField: "etat",
                caption: "Etape de saisie",
                lookup: {
                    dataSource: etatStatSaisie,
                    displayExpr: "valeur",
                    valueExpr: "cle"
                }
            },
            {
                dataField: "commentaire",
                caption: "Commentaire",
                width: 350
            },
            {
                dataField: "createdAt",
                caption: "Créé",
                dataType: "date"
            },
            {
                dataField: "updatedAt",
                caption: "Mise à jour le",
                dataType: "date"
            }],
            onCellPrepared: function (e) {
                if (e.rowType === "data") {
                    if (e.column.dataField === "etat") {
                        switch (e.data.etat) {
                            case '1-vide':
                                e.cellElement.css({ "background-color": "rgb(238, 76, 76)"});
                                break;
                            case '2-encours':
                                e.cellElement.css({ "background-color": "rgb(236, 187, 217)"});
                                break;
                            case '3-fait':
                                e.cellElement.css({ "background-color": "#C9ECD7"});
                                break;
                          }
                    }
                }
            },
    }).dxDataGrid("instance");
    

    })