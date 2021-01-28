$(function(){

   var store = new DevExpress.data.CustomStore({
        key: "id",
        load: function () {
           return getItems(urlSignalementCustom)					
                },
        update: function(key, values) {
			console.log(values);
			return updateItems(urlSignalement,key,values);
        }  ,
        insert: function(values) {
            return createItems(urlSignalement,values);
        },  
        remove: function(key) {
            return deleteItems(urlSignalement,key);
        }       
    });

    var storeBdd = new DevExpress.data.CustomStore({
        key: "id",
        load: function () {
           return getItems(urlBdd)					
                },
        update: function (key, values) {
           return updateItems(urlBdd, key, values);
        }      
    });

    $("#gridContainerSignalement").dxDataGrid({
        dataSource: store,
        showBorders: true,
        repaintChangesOnly: true,
        showBorders: true,
        rowAlternationEnabled: true,
        columnResizingMode: "nextColumn",
        allowColumnReordering: true,
        columnMinWidth: 50,
        columnAutoWidth: true,
        columnHidingEnabled: true,
        columnChooser: {
         enabled: true,
         mode:"select"
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
            allowedPageSizes: [10, 20, 50,100,150],
            showInfo: true
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
        },
        groupPanel: {
            emptyPanelText: "Drag & Drop colonnes pour effectuer des regroupements",
            visible: true
        },
        "export": {
          enabled: true,
          fileName: "Bdds_signalement"
         },
        editing: {
            mode: "popup",
            popup: {
                title: "Métadonnées de signalement",
                showTitle: true,
                width: 1100,
                height: 600
            },
            form: {
                items: [
                    {
                    itemType: "group",
                    colCount: 2,
                    colSpan: 2,
                    caption: "Données Primo",
                    items: ["bdd_id", "icone", "nom_court", "source", "url", "proxified_url", "editeur", "disc", "langue", "type_contenu", "type_acces", "note_acces",{
                        dataField: "description",
                        editorType: "dxTextArea",
                        colSpan: 2,
                        editorOptions: {
                            height: 50
                        }
                    }, "type_base", "tuto", "new", "alltitles"]
                    },
                    {
                        itemType: "group",
                        colCount: 2,
                        colSpan: 2,
                        caption: "Infos locales",
                        items: ["uca", "mode_consultation",
                        {
                          dataField: "description_long",
                          editorType: "dxTextArea",
                          colSpan: 2,
                          editorOptions: {
                              height: 50
                          }
                      },
                        {
                            dataField: "commentaire",
                            editorType: "dxTextArea",
                            colSpan: 2,
                        },"createdAt","updatedAt"]
                        }
                ]
            },
            allowUpdating: true,
            allowAdding: true,
            allowDeleting: true,
            useIcons: true
             },
        columns: [
         {
            type: "buttons",
            caption: "Editer",
            width: 110,
            buttons: ["edit", "delete", {
                hint: "Clone",
                icon: "repeat",
                onClick: function(e) {
                    var clonedItem = $.extend({}, e.row.data, { id: "" });
                    var filtered = _.pick(clonedItem, function (v) { return v !== '' && v !== null; });
                    createItems(urlSignalement, filtered)
                    e.component.refresh(true);
                    e.event.preventDefault();
                }
            }]
            },
      {
        dataField: "bdd_id",
        caption: "Ressource",
        lookup: 
        {
            dataSource: new DevExpress.data.CustomStore({
                key: "id",
                loadMode: "raw",
        load: function() {
            return getItems(urlBdd)
        }
      })		,
            valueExpr: "id",
            displayExpr: "bdd"
        }
      }, 
      {
        dataField: "icone",
        caption: "Icone",
        width: 100,
        allowFiltering: false,
        allowSorting: false,
        cellTemplate: function (container, options) {
            $("<div>")
                .append($("<img>", { "src": "http://catalogue.unice.fr/primo_library/libweb/images/icones_bdd/"+options.value }))
                .appendTo(container);
        }
      },
      {
        dataField: "nom_court",
        caption: "Nom court",
        visible: false
      }, 
      {
        dataField: "source",
        caption: "Source (diffuseur)",
        validationRules: [{ type: "required" }]
      },
      {
        dataField: "url",
        caption: "URL"
      },
      {
        dataField: "proxified_url",
        caption: "URL proxifiée",
        validationRules: [{ type: "required" }]
      },
      {
        dataField: "editeur",
        caption: "Editeur",
        validationRules: [{ type: "required" }]
      },
      {
        dataField: "disc",
        caption: "Discipline(s)",
        width: 200,
        allowSorting: false,
        //validationRules: [{ type: "required" }],
      },
      {
        dataField: "langue",
        caption: "Langue",
      },
      {
        dataField: "type_contenu",
        caption: "Type de contenu",
      },
      {
        dataField: "type_acces",
        caption: "Type d'accès",
        lookup: {
            dataSource: accessState,
            displayExpr: "valeur",
            valueExpr: "cle"
        }
      },
      {
        dataField: "note_acces",
        caption: "Note sur l'accès"
      },
      {
        dataField: "description",
        caption: "Description"
      },
      {
        dataField: "type_base",
        caption: "Type de base",
        lookup: {
            dataSource: typeBase,
            displayExpr: "valeur",
            valueExpr: "cle"
        }
      },
      {
        dataField: "tuto",
        caption: "Tutoriel",
      },
      {
        dataField: "new",
        caption: "Nouveauté ([Obsolète] ne plus remplir)",
      },
      {
        dataField: "alltitles",
        caption: "Lien tous titres",
      },
      {
        dataField: "uca",
        caption: "Accès membres UCA"
      },
      {
        dataField: "mode_consultation",
        caption: "Mode de consultation"
      },
      {
        dataField: "description_long",
        caption: "Description détaillée"
      },
      {
        dataField: "commentaire",
        caption: "Commentaire"
      },
      {
        dataField: "createdAt",
        caption: "Crée le",
        visible: false,
      },
      {
        dataField: "updatedAt",
        caption: "Modifié le"
      }],
      masterDetail: {
          enabled: true,
          template: function(container, options) { 
              var currentBdd = options.data;
              $("<div>")
                  .addClass("master-detail-caption")
                  .text("Informations niveau haut configuration")
                  .appendTo(container);
      
              $("<div>")
                  .dxDataGrid({
                      columnAutoWidth: true,
                      showBorders: true,
                      editing: {
                          mode: "popup",
                          allowUpdating: true,
                          useIcons: true},
                      columns: [{
                          dataField: "achat_perenne",
                          caption: "Achat pérenne",
                          lookup: {
                              dataSource: achatperenneState,
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
                          dataField: "type_achat",
                          caption: "Type d'achat'",
                          lookup: {
                              dataSource: typeAchatState,
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
                          dataField: "stats_get_mode",
                          caption: "Statistiques",
                          lookup: {
                              dataSource: getStatState,
                              displayExpr: "valeur",
                              valueExpr: "cle"
                          }
                      },],
                      dataSource: new DevExpress.data.DataSource({
                          store: storeBdd,
                          filter: ["id", "=", currentBdd.bdd_id]
                      })
                  }).appendTo(container);
          }
      }
      })
	
	$("#file-uploader").dxFileUploader({
        name: "file",
        selectButtonText: "Importer un fichier",
        labelText: "",
        accept: "*",
        uploadMode: "useButtons",
        uploadUrl: urlSignalement + "_import"
    });

    getItems(urlSignalement + "_readdir").done(function(result){
        return result.map(function(d){$("#files-dirread").append("<li>"+d.file+"</li>")})
    })
   
});
    
