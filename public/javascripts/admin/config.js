$(function(){
    var storeUsers = new DevExpress.data.CustomStore({
        key: "id",
        load: function () {
           return getItems(urlUser)					
                },
        update: function(key, values) {
			return updateItems(urlUser,key,values);
        },
        insert: function(values) {
            return createItems(urlUser,values);
        },  
        remove: function(key) {
            return deleteItems(urlUser,key);
        }      
    });

    var storeBU = new DevExpress.data.CustomStore({
        key: "id",
        load: function () {
           return getItems(urlBU)					
                },
        update: function(key, values) {
			return updateItems(urlBU,key,values);
        },
        insert: function(values) {
            return createItems(urlBU,values);
        },
        remove: function(key) {
            return deleteItems(urlBU,key);
        }         
    });

    $("#gridContainerUsers").dxDataGrid({
        dataSource: storeUsers,
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
         fileName: "Utilisateurs"
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
        allowAdding: true,
        allowUpdating: true,
        allowDeleting: true,
        useIcons: true
        },
         columns: [
            {
                type: "buttons",
                caption: "Editer",
                buttons: ["edit", "delete"]
            },
            {
                dataField: "username",
                caption: "Nom d'utilisateur"
            },
            {
                dataField: "password",
                caption: "Mot de passe"
            } ,  
            {
                dataField: "bu_id",
                caption: "BU",
                lookup: 
        {
            dataSource: new DevExpress.data.CustomStore({
                key: "id",
                loadMode: "raw",
                load: function() {
                return getItems(urlBU)
                }
               }),
               valueExpr: "id",
               displayExpr: "bu"
               }
               } ,
              {
                dataField: "groupe",
                caption: "Groupe",
                lookup: {
                    dataSource: userGroups,
                    displayExpr: "valeur",
                    valueExpr: "cle"
                   }
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
$("#gridContainerBU").dxDataGrid({
    dataSource: storeBU,
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
     fileName: "BU"
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
    allowAdding: true,
    allowUpdating: true,
    allowDeleting: true,
    useIcons: true
    },
     columns: [
        {
            type: "buttons",
            caption: "Editer",
            buttons: ["edit", "delete"]
        },
        {
            dataField: "bu",
            caption: "Nom",
            width: 125
        },
        {
            dataField: "code_bib_aleph",
            caption: "Code Bib Aleph",
            dataType: "date"
        } ,  
        {
            dataField: "latitude",
            caption: "Latitude"
        } ,
        {
            dataField: "longitude",
            caption: "Longitude"
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
})