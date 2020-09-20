$(function(){
    var storeDiscs = new DevExpress.data.CustomStore({
        key: "id",
        byKey: function (key) {  
            return $.get(urlDisc + "/" + key.toString());  
        },
        load: function () {
           return getItems(urlDisc)					
                },
        update: function(key, values) {
			return updateItems(urlDisc,key,values);
        },
        insert: function(values) {
            return createItems(urlDisc,values);
        },  
        remove: function(key) {
            return deleteItems(urlDisc,key);
        }      
    });
    $("#gridContainerDisc").dxTreeList({
        dataSource: storeDiscs,
        rootValue: -1,
        keyExpr: "id",
        parentIdExpr: "parent_id",
        columns: [
            {
                type: "buttons",
                caption: "Editer",
                width: 110,
                buttons: ["edit", "delete"]
                },
            {
            dataField: "disc",
            caption: "Discipline"
        }, 
        {
            dataField: "code",
            caption: "Code",
        },
        {
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
        },
        {
            dataField: "actif",
            caption: "Actif",
            lookup: {
                dataSource: binaryState,
                displayExpr: "valeur",
                valueExpr: "cle"
             }
        },
        {
            dataField: "commentaire",
            caption: "Commentaire"
        }, {
            dataField: "createdAt",
            caption: "Crée le",
            visible: false,
          },
        {
           dataField: "updatedAt",
           caption: "Modifié le",
           visible: false,
       }],
        expandedRowKeys: [1,2,3,4,5],
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        scrolling: {
            mode: "standard"
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
        editing: {
            mode: "popup",
            allowUpdating: true,
            allowDeleting: true,
            allowAdding: true,
            useIcons: true,
            form: {
                items: [
                    {
                        itemType: "group",
                        items: ["disc","code","parent_id","actif"]
                    },
                    {
                        itemType: "group",
                        colCount: 2,
                        items: ["createdAt", "updatedAt"]
                    }]
        }}
    });
});