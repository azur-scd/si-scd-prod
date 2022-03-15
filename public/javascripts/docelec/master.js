$(function(){
	
	let editMode = true;
    if ($('#usergroup').val() == "guest") {
      editMode = false
    }

   var storeBdd = new DevExpress.data.CustomStore({
        key: "id",
        load: function () {
           return getItems(urlBdd)					
                },
        update: function(key, values) {
			return updateItems(urlBdd,key,values);
        },
        insert: function(values) {
            return createItems(urlBdd,values);
        },  
        remove: function(key) {
            return deleteItems(urlBdd,key);
        }      
    });
	
	 var storeBdd2Disc = new DevExpress.data.CustomStore({
        key: "id",
        load: function () {
            return getItems(urlBdd2Disc)
        },
        update: function (key, values) {
            return updateItems(urlBdd2Disc, key, values);
        },
        insert: function (values) {
            return createItems(urlBdd2Disc, values);
        },
        remove: function (key) {
            return deleteItems(urlBdd2Disc, key);
        }
    });


    var storeGC = new DevExpress.data.CustomStore({
        key: "id",
        load: function () {
           return getItems(urlGC)					
                },
        update: function(key, values) {
			return updateItems(urlGC,key,values);
        },
        insert: function(values) {
            return createItems(urlGC,values);
        },
        remove: function(key) {
            return deleteItems(urlGC,key);
        }         
    });

    var storeStatsReports = new DevExpress.data.CustomStore({
        key: "id",
        load: function () {
           return getItems(urlStatsReports)					
                },
        update: function(key, values) {
			return updateItems(urlStatsReports,key,values);
        },
        insert: function(values) {
            return createItems(urlStatsReports,values);
        },
        remove: function(key) {
            return deleteItems(urlStatsReports,key);
        }         
    });
	
	  function tagBoxEditorTemplate(cellElement, cellInfo) {
        return $('<div>').dxTagBox({
          dataSource: typePerimetre,
          value: cellInfo.value,
          valueExpr: 'cle',
          displayExpr: 'valeur',
          showSelectionControls: true,
          maxDisplayedTags: 3,
          showMultiTagOnly: false,
          applyValueMode: 'useButtons',
          searchEnabled: true,
          onValueChanged(e) {
            cellInfo.setValue(e.value);
          },
          onSelectionChanged() {
            cellInfo.component.updateDimensions();
          },
        });
      }

    $("#gridContainerBdd").dxDataGrid({
        dataSource: storeBdd,
        repaintChangesOnly: true,
        showBorders: true,
        columnAutoWidth: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        allowColumnReordering: true,
        columnHidingEnabled: true,
        paging: {
            pageSize: 10
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50,100,150],
            showInfo: true
        },
        "export": {
          enabled: true,
          fileName: "Bdds"
        },
        grouping: {
         contextMenuEnabled: true,
         expandMode: "rowClick"
        },   
       groupPanel: {
         emptyPanelText: "Drag & Drop colonnes pour effectuer des regroupements",
         visible: true
       },
       columnChooser: {
         enabled: true,
        mode: "select"
       },
        headerFilter: {
            visible: true
        },
        filterPanel: { visible: true },
        filterRow: {
            visible: true,
            applyFilter: "auto"
        },
        searchPanel: {
            visible: true
        },
       editing: {
        mode: "popup",
        allowAdding: editMode,
        allowUpdating: editMode,
        //allowDeleting: true,
        useIcons: true,
        popup: {
            title: "Configuration de la ressource",
            showTitle: true,
            width: 1100,
            height: 600,
           /* position: {
                my: "top",
                at: "top",
                of: window
            }*/
        },
        form: {
            items: [
                {
                    itemType: "group",
                    colCount: 2,
                    colSpan: 2,
                    items: ["bdd", "type","gestion","signalement"]
                },{
                itemType: "group",
                caption: "Gestion",
                colCount: 2,
                colSpan: 2,
                items: ["pole_gestion", "type_marche", "gc_id", "soutien_oa","perimetre","type_achat","achat_perenne"]
            }, 
            {
                itemType: "group",
                caption: "Signalement",
                colCount: 2,
                colSpan: 2,
                items: ["type_signalement", "mode_signalement"]
            },
            {
                itemType: "group",
                caption: "Statistiques",
                colCount: 2,
                colSpan: 2,
                items: ["stats_collecte","calcul_esgbu","stats_counter", "stats_get_mode", "stats_url_sushi","sushi_requestor_id","sushi_customer_id","sushi_api_key","stats_url_admin","stats_login","stats_mdp","stats_mail"]
            },
            {
                itemType: "group",
                caption: "Notes",
                items: [{
                    dataField: "commentaire",
                    editorType: "dxTextArea",
                    editorOptions: {
                        height: 100
                    }
                }]
            }]
        }
},
        columns: [
          {
        type: "buttons",
        caption: "Editer",
       // buttons: ["edit", "delete"]
       buttons: ["edit"]
         },
         {
        dataField: "bdd",
        caption: "Ressource",
        validationRules: [{ type: "required" }]
         },  
        {
        dataField: "gestion",
        caption: "Gestion",
        showEditorAlways: true,
        editCellTemplate: function(cellElement, cellInfo) {
        if(cellInfo.value) {
          Object.keys(cellInfo.value).forEach(function(key) {
            $("<div />").dxCheckBox({
                text: key,
                value: cellInfo.value[key],
                onValueChanged: function(e) {
                  cellInfo.value[key] = e.value
                  cellInfo.setValue(cellInfo.value)  
                         }
             }).appendTo(cellElement);
            })
           }
          },
        },
    {
        dataField: "signalement",
        caption: "Signalement",
        lookup: {
            dataSource: binaryState,
            displayExpr: "valeur",
            valueExpr: "cle"
        },
        validationRules: [{ type: "required" }]
    }, 
    {
        dataField: "type",
        caption: "Type de ressource",
        lookup: {
            dataSource: typeBddState,
            displayExpr: "valeur",
            valueExpr: "cle"
        }
    },
    {
        dataField: "pole_gestion",
        caption: "Pole gestionnaire",
        lookup: {
    dataSource: poleState,
    displayExpr: "valeur",
    valueExpr: "cle"
}
    }, 
    {
        dataField: "type_marche",
        caption: "Type de marché",
        lookup: {
    dataSource: marcheState,
    displayExpr: "valeur",
    valueExpr: "cle"
}
    },
    {
        dataField: "gc_id",
        caption: "Groupement de commande",
        alignment: "left",
       // editCellTemplate: "GCEditorTemplate",
        lookup:
        {
            dataSource: new DevExpress.data.CustomStore({
            key: "id",
            loadMode: "raw",
            load: function() {
                return getItems(urlGC)
             }
        }),
            valueExpr: "id",
            displayExpr: "nom"
        }
    },
    {
        dataField: "soutien_oa",
        caption: "Soutien OA",
        lookup: {
         dataSource: typeOA,
         displayExpr: "valeur",
         valueExpr: "cle"
    }
    },
            {
                dataField: "perimetre",
                caption: "Périmètre abonnement",
                editCellTemplate: function(cellElement, cellInfo) {
                   return $('<div>').dxTagBox({
                    dataSource: typePerimetre,
                    value: cellInfo.value.split(','),
                    valueExpr: 'cle',
                    displayExpr: 'valeur',
                    showSelectionControls: true,
                    maxDisplayedTags: 3,
                    showMultiTagOnly: false,
                    applyValueMode: 'useButtons',
                    searchEnabled: true,
                    onValueChanged(e) {
                        console.log(e.value)
                        cellInfo.setValue(e.value.join(','));
                      },
                     /* onSelectionChanged() {
                        info.component.updateDimensions();
                      },*/
                   })
                    
                },
                lookup: {
                    dataSource: typePerimetre,
                    displayExpr: "valeur",
                    valueExpr: "cle"
                },
                cellTemplate(container, options) {
                    const noBreakSpace = '\u00A0';
                    const text = (options.value).split(',').map((element) => typePerimetre.filter((el) => el.cle == element)[0].valeur).join(',')
                    container.text(text || noBreakSpace);                   
                  },

            },
    {
        dataField: "type_achat",
        caption: "Type d'achat",
        lookup: {
            dataSource: typeAchatState,
            displayExpr: "valeur",
            valueExpr: "cle"
        }
    },
    {
        dataField: "achat_perenne",
        caption: "Achat pérenne",
        lookup: {
            dataSource: achatperenneState,
            displayExpr: "valeur",
            valueExpr: "cle"
        }
    }, 
    {
        dataField: "type_signalement",
        caption: "Type de signalement",
        lookup: {
            dataSource: typeSignalement,
            displayExpr: "valeur",
            valueExpr: "cle"
        }
    },
    {
        dataField: "mode_signalement",
        caption: "Modalité de signalement (du titre à titre)",
        lookup: {
            dataSource: modeSignalement,
            displayExpr: "valeur",
            valueExpr: "cle"
        }
    },
    {
        dataField: "type_signalement",
        caption: "Type de signalement",
        lookup: {
            dataSource: typeSignalement,
            displayExpr: "valeur",
            valueExpr: "cle"
        }
    },
    {
        dataField: "mode_signalement",
        caption: "Modalité de signalement",
        lookup: {
            dataSource: modeSignalement,
            displayExpr: "valeur",
            valueExpr: "cle"
        }
    },
    /*{
        dataField: "pref_stats_reports_id",
        caption: "Rapport stat (visu par défaut)",
        alignment: "left",
        lookup: 
        {
            dataSource: new DevExpress.data.CustomStore({
                key: "id",
                loadMode: "raw",
        load: function() {
            return getItems(urlStatsReports)
        }
       }),
            valueExpr: "id",
            displayExpr: "mesure"
        }
        },*/
		 {
                dataField: "stats_collecte",
                caption: "Collecte des statistiques de consultation",
                showEditorAlways: true,
                editCellTemplate: function(cellElement, cellInfo) {
                    if(cellInfo.value) {
                    Object.keys(cellInfo.value).forEach(function(key) {
                    $("<div />").dxCheckBox({
                        text: key,
                        value: cellInfo.value[key],
                        onValueChanged: function(e) {
                            cellInfo.value[key] = e.value
                            cellInfo.setValue(cellInfo.value)  
                         }
                    }).appendTo(cellElement);
                })
            }
                },
            },
            {
                dataField: "calcul_esgbu",
                caption: "Prise en compte des stats dans l'ESGBU",
                showEditorAlways: true,
                editCellTemplate: function(cellElement, cellInfo) {
                    if(cellInfo.value) {
                    Object.keys(cellInfo.value).forEach(function(key) {
                    $("<div />").dxCheckBox({
                        text: key,
                        value: cellInfo.value[key],
                        onValueChanged: function(e) {
                            cellInfo.value[key] = e.value
                            cellInfo.setValue(cellInfo.value)  
                         }
                    }).appendTo(cellElement);
                })
            }
                },
            },
       {
        caption: "Stats collecte : configuration",
        columns: [
		 {
                        dataField: "stats_counter",
                        caption: "Conforme Counter",
                        lookup: {
                            dataSource: statsCounter,
                            displayExpr: "valeur",
                            valueExpr: "cle"
                        }
                    },
       {
        dataField: "stats_get_mode",
        caption: "Modalité",
        lookup: {
            dataSource: getStatState,
            displayExpr: "valeur",
            valueExpr: "cle"
        }
    },
    {
        dataField: "stats_url_admin",
        caption: "Url compte admin"
    },
    {
        dataField: "stats_url_sushi",
        caption: "Url racine SUSHI"
    },
	{
        dataField: "sushi_requestor_id",
        caption: "SUSHI Requestor Id"
    },
    {
        dataField: "sushi_customer_id",
        caption: "SUSHI Customer Id"
    },
	 {
        dataField: "sushi_api_key",
        caption: "SUSHI API Key"
    },
    {
        dataField: "stats_login",
        caption: "Login"
    },
    {
        dataField: "stats_mdp",
        caption: "Mot de passe"
    },
    {
        dataField: "stats_mail",
        caption: "Contact mail"
    }]
    },
    {
        dataField: "commentaire",
        width: 125
    },  
    {
        dataField: "createdAt",
        caption: "Créé",
        dataType: "date"
    } ,  
    {
        dataField: "updatedAt",
        caption: "Mise à jour le",
        dataType: "date"
    }] ,
    onCellPrepared: function(e) {
        if(e.rowType === "data") {
            if(e.column.dataField === "signalement") {
                if(e.data.signalement === 1){
                e.cellElement.css({ "background-color": "#C9ECD7", "font-weight": "bold" });
                }
            }
        }
    },
	 onRowUpdating: function(e) {
             for (x in e.newData) {
                    if(e.newData[x] !== undefined && e.newData[x] !== null && e.newData[x].constructor == Object) {
                        e.newData[x] = JSON.stringify(e.newData[x])
                    }
                }
                for (x in e.oldData) {
                    if(e.oldData[x] !== undefined && e.oldData[x] !== null && e.oldData[x].constructor == Object) {
                        e.newData[x] = JSON.stringify(e.oldData[x])
                    }
                }
        },
        onInitNewRow: function(e) {
            e.data.gestion =  {"2019":true,"2020":false,"2021":false,"2022":false,"2023":false,"2024":false,"2025":false,"2026":false,"2027":false,"2028":false}
            e.data.stats_collecte =  {"2019":true,"2020":false,"2021":false,"2022":false,"2023":false,"2024":false,"2025":false,"2026":false,"2027":false,"2028":false}
            e.data.calcul_esgbu =  {"2019":true,"2020":false,"2021":false,"2022":false,"2023":false,"2024":false,"2025":false,"2026":false,"2027":false,"2028":false}
        },
        onRowInserting: function(e) {
            for (x in e.data) {
                if(e.data[x] !== undefined && e.data[x] !== null && e.data[x].constructor == Object) {
                    e.data[x] = JSON.stringify(e.data[x])
                }
            }
            console.log(e.data)
    },
    })
	
	$("#autoExpand").dxCheckBox({
        value: true,
        text: "Plier/Déplier tout",
        onValueChanged: function(data) {
            $("#containerBdd2Disc").dxDataGrid("instance").option("grouping.autoExpandAll", data.value);
        }
    });

    //function GCEditorTemplate(cellElement, cellInfo) { } : https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/CustomEditors/jQuery/Light/
    $("#gridContainerGC").dxDataGrid({
        dataSource: storeGC,
        repaintChangesOnly: true,
        showBorders: true,
        columnAutoWidth: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        allowColumnReordering: true,
        paging: {
            pageSize: 5
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [5, 10, 20, 50,100],
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
       editing: {
        mode: "popup",
        allowAdding: editMode,
        allowUpdating: editMode,
        allowDeleting: editMode,
        useIcons: true
        },
         columns: [
            {
                type: "buttons",
                caption: "Editer",
                buttons: ["edit", "delete"]
            },
            {
                dataField: "nom",
                caption: "Nom du GC",
                width: 125
            },
            {
                dataField: "bdd_id",
                caption: "Ressource",
                //groupIndex: 0,
                lookup:{
                    dataSource: new DevExpress.data.CustomStore({
                        key: "id",
                        loadMode: "raw",
                        load: function () {
                            return getItems(urlBdd)
                        },
                    }),
                    valueExpr: "id",
                    displayExpr: "bdd"
                }
            },
            {
                dataField: "debut",
                caption: "Date de début"
            } ,  
            {
                dataField: "fin",
                caption: "Date de fin"
            } ,
            {
                dataField: "montant_ttc",
                caption: "Montant",
                dataType: 'number',
            },
            {
                dataField: "porteur",
                caption: "Etablissement porteur"
            },
            {
                dataField: "contact",
                caption: "Contact"
            },
            {
                dataField: "num_bon_commande",
                caption: "Numéro de bon de commande"
            },
            {
                dataField: "commentaire",
                caption: "Commentaire",
                width: 125
            },
            {
                dataField: "createdAt",
                caption: "Créé",
                dataType: "date"
            } ,  
            {
                dataField: "updatedAt",
                caption: "Mise à jour le",
                dataType: "date"
            } 
         ]
})
	
	
    $("#containerBdd2Disc").dxDataGrid({
        dataSource: storeBdd2Disc,
        editing: {
            mode: "popup",
            allowUpdating: editMode,
            allowDeleting: editMode,
            allowAdding: editMode,
            useIcons: true
        },
        showBorders: true,
        columnAutoWidth: true,
        allowColumnResizing: true,
        allowColumnReordering: true,
        paging: {
            pageSize: 20
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50, 100, 150],
            showInfo: true
        },
        "export": {
            enabled: true,
            fileName: "Bdd_disciplines"
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
        columns: [
            {
                type: "buttons",
                caption: "Editer",
                buttons: ["edit", "delete", {
                    hint: "Clone",
                    icon: "repeat",
                    onClick: function(e) {
						 if ($('#usergroup').val() != "guest") {
                        var clonedItem = $.extend({}, e.row.data, { id:""});
                        createItems(urlBdd2Disc, clonedItem)
                        e.component.refresh(true);
						 }
                    }
                }],
                width: 80
            },
            {
                dataField: "bdd_id",
                caption: "Ressource",
                groupIndex: 0,
                lookup:
                /*{
                    dataSource: {
                        store: storeBdd,
                        sort: "bdd"
                    },
                    valueExpr: "id",
                    displayExpr: "bdd"
                }*/
                {
                    dataSource: new DevExpress.data.CustomStore({
                        key: "id",
                        loadMode: "raw",
                        load: function () {
                            return getItems(urlBdd)
                        },
                    }),
                    valueExpr: "id",
                    displayExpr: "bdd"
                }
            },
            {
                dataField: "disc_id",
                caption: "Discipline",
                lookup:
                {
                    dataSource: new DevExpress.data.CustomStore({
                        key: "id",
                        loadMode: "raw",
                        load: function () {
                            return getItems(urlDisc)
                        }
                    }),
                    valueExpr: "id",
                    displayExpr: "disc"
                }
            }, {
                dataField: "quotite",
                caption: "Pourcentage du contenu",
                dataType: "number",
                width: 250
            },
            {
                dataField: "commentaire",
                caption: "Commentaire",
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
            }
        ],
        summary: {
            groupItems: [{
                column: "bdd_id",
                summaryType: "count",
                displayFormat: "{0} item(s) associé(s)",
            },
			{column: "quotite",
            summaryType: "sum",
            displayFormat: "Total {0} %",
        }]
        }
    })
	
    $("#gridContainerReports").dxDataGrid({
                dataSource: storeStatsReports,
                repaintChangesOnly: true,
				showBorders: true,
				columnAutoWidth: true,
				allowColumnResizing: true,
				allowColumnReordering: true,
				paging: {
					pageSize: 10
				},
				pager: {
					showPageSizeSelector: true,
					allowedPageSizes: [10, 20, 50,100,150],
					showInfo: true
				},
                "export": {
                  enabled: true,
                 fileName: "Types rapports stats"
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
                mode: "popup",
                allowAdding: editMode,
                allowUpdating: editMode,
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
                dataField: "mesure",
                caption: "Statistiques mesurées"
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
            }]   
    })
});