$(function () {

    annualTotalBar($("#selected_year").val(),$("#selected_report").val())

    var storeStatsReports = new DevExpress.data.CustomStore({
        loadMode: "raw",
        load: function () {
            return getItems(urlStatsReports);
        }
    });

    $("#selectbox-years").dxSelectBox({
        width: 150,
        items: years,
        valueExpr: "cle",
        displayExpr: "valeur",
        value: parseInt($("#selected_year").val()),
        onValueChanged: function (data) {
            $("#selected_year").val(data.value)
            return annualTotalBar($("#selected_year").val(), $("#selected_report").val())
        }
    });

    $("#selectbox-reports").dxSelectBox({
        dataSource: storeStatsReports,
        valueExpr: "id",
        displayExpr: "mesure",
        value: parseInt($("#selected_report").val()),
        validationRules: [{
            type: "required",
            message: "Name is required"
        }],
        onValueChanged: function (data) {
            $("#selected_report").val(data.value)
            return annualTotalBar($("#selected_year").val(), $("#selected_report").val())
        }
    });

    function annualTotalReportStore(year, report) {
        return new DevExpress.data.CustomStore({
            key: "id",
            load: function () {
                return getItems(urlStatsIndicators + "?year=" + year + "&stats_reports_id=" + report)
                    .then(function (data) {
                        console.log(data)
                        var result = data.map(function(d) {
                            var costperuse = d.montant / d.count
                            return Object.assign(d, {"indicator": costperuse})
                        })
                        .sort(function (a, b) {
                            return b.count - a.count;
                        })
                        //result["date"] = year
                        console.log(result)
                        return result
                    })
            }
        });
    }
    function annualTotalBar(year,report) {
        //return getSimpleBar("totalBarChart", annualTotalReportStore(year, report), "bdd", "count", "")
        return getBarLine("totalBarChart", annualTotalReportStore(year, report), "bdd", "count", "Usage","indicator","Coût par usage","")
    }

})