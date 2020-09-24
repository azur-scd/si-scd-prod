$(function(){

   var store = new DevExpress.data.CustomStore({
        key: "id",
        load: function () {
           return getItems(urlSignalement)					
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
        "export": {
           enabled: true,
           fileName: "Bdds_signalement"
         },
        columnChooser: {
         enabled: true,
         mode:"select"
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
        editing: {
            mode: "popup",
            popup: {
                title: "Métadonnées de signalement",
                showTitle: true,
                width: 1100,
                height: 600
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
            buttons: ["edit", "delete"]
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
            return getItems(urlBdd +"?signalement=1")
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
        caption: "Source"
    },
    {
        dataField: "url",
        caption: "URL"
    },
    {
        dataField: "proxified_url",
        caption: "URL proxifiée"
    },
    {
        dataField: "editeur",
        caption: "Editeur"
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
        caption: "Note sur l'accès",
        formItem: {
            colSpan: 2,
            editorType: "dxTextArea",
            editorOptions: {
                height: 100
            }
        }
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
        dataField: "alltitles",
        caption: "Lien tous titres",
    },
    {
        dataField: "uca",
        caption: "Accès membres UCA",
        formItem: {
            colSpan: 2,
            editorType: "dxTextArea",
            editorOptions: {
                height: 100
            }
        }
    },
    {
        dataField: "commentaire",
        caption: "Commentaire",
        formItem: {
            colSpan: 2,
            editorType: "dxTextArea",
            editorOptions: {
                height: 100
            }
        }
    },
    {
        dataField: "createdAt",
        caption: "Crée le",
        visible: false,
    },
    {
        dataField: "updatedAt",
        caption: "Modifié le"
    }]
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
    
