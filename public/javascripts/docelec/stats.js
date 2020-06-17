$(function(){
    var urlBdd = "./api/bdds"
    var urlStats = "./api/bdds_all_stats"
    var urlStatsReports = "./api/stats_reports"

    var year ; var bdd ; var report ;

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

  
    
    $("#selectbox-bdd").dxSelectBox({
        dataSource: storeBdd,
        valueExpr: "id",
        displayExpr: "bdd",
        onValueChanged: function(data) {
            bdd = data.value
            return getStatSFocus(year,bdd,report)
        }
    });

    $("#selectbox-reports").dxSelectBox({
        dataSource: storeStatsReports,
        valueExpr: "id",
        displayExpr: "display",
        onValueChanged: function(data) {
            report = data.value
            return getStatSFocus(year,bdd,report)
        }
    });

    $("#selectbox-years").dxSelectBox({
        width: 150,
        items: years,
        valueExpr: "cle",
        displayExpr: "valeur",
        onValueChanged: function(data) {
            year = data.value
            return getStatSFocus(year,bdd,report)
        }
    });

    function getStatSFocus(year,bdd,report) {
        return getItems(urlStats+"/?bddId="+bdd+"&reportId="+report+"&year="+year)
        .done(function(data) {
            var result = data
              .map(function(d){return {"id":d.id,"periodeDebut":d.periodeDebut,"dimension":d.dimension,"count":d.count}})
                var items = result.sort(function(a, b) {
                return parseFloat(a.periodeDebut.split("-")[1]) - parseFloat(b.periodeDebut.split("-")[1]);
              }) 
                 return 'var form = $("#form").dxForm({'+
                 'formData: '+items+','+
                 'readOnly: false,'+
                 'showColonAfterLabel: true,'+
                 'labelLocation: "top",'+
                 'minColWidth: 300,'+
                 'colCount: 2'+
             '}).dxForm("instance");'
        })
    }

})