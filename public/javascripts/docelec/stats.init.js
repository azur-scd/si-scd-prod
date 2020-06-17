$(function(){
    var urlBdd = "./api/bdds"
    var urlStats = "./api/bdds_stats"
    var urlStatsReports = "./api/stats_reports"
    var storeBdd = new DevExpress.data.CustomStore({
        loadMode: "raw",
        load: function() {
            return $.getJSON(urlBdd);
        }
    });
    
    var storeStats = new DevExpress.data.CustomStore({
        loadMode: "raw",
        load: function() {
            return $.getJSON(urlStats);
        }
    });

    var storeStatsReports = new DevExpress.data.CustomStore({
        loadMode: "raw",
        load: function() {
            return $.getJSON(urlStatsReports);
        }
    });

    var formDataSource = new DevExpress.data.DataSource({
        store:storeStats,
        //filter: [["periodeDebut", "startswith", "2019"],"and", [ "bdd_id", "=", 1 ], "and", [ "stats_reports_id", "=", 1 ]],
        postProcess: function(results) {
            console.log(results)
            return results;
        }
    });

    var dataGrid = $("#gridContainerFormStat").dxDataGrid({
        dataSource: formDataSource,
        repaintChangesOnly: true,
        showBorders: true,
        "export": {
            enabled: true,
           fileName: "stats"
          },
          editing: {
            mode: "batch",
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
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
            columns: [
                {
                    dataField: "bdd_id",
                    caption: "Ressource",
                    lookup: 
                    {
                        dataSource: storeBdd,
                        valueExpr: "id",
                        displayExpr: "bdd"
                    }
                },
                {
                    dataField: "stats_reports_id",
                    caption: "Type de stats",                  
                    lookup: 
                    {
                        dataSource: storeStatsReports,
                        valueExpr: "id",
                        displayExpr: "display"
                    }
                }, 
            {
                dataField: "dimension",
                caption: "Mois",
                width: 100,
            }, 
            {
                dataField: "count",
                caption: "Valeur",
                width: 100,
            }]
    }).dxDataGrid("instance");
    
    $("#selectbox-bdd").dxSelectBox({
        dataSource: storeBdd,
        valueExpr: "id",
        displayExpr: "bdd",
        value: 1,
        onValueChanged: function(data) {
            formDataSource.filter(["bdd_id", "=", data.value]);formDataSource.load();
        }
    });

    $("#selectbox-reports").dxSelectBox({
        dataSource: storeStatsReports,
        valueExpr: "id",
        displayExpr: "display",
        value: 1,
        onValueChanged: function(data) {
            formDataSource.filter(["stats_reports_id", "=", data.value]);formDataSource.load();
        }
    });

    $("#selectbox").dxSelectBox({
        width: 150,
        items: years,
        value: 2019,
        valueExpr: "cle",
        displayExpr: "valeur",
        onValueChanged: function(data) {
            formDataSource.filter(["periodeDebut", "startswith", "'+data.value+'"]);formDataSource.load();
        }
    });
})