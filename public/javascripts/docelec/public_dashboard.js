$(function () {

    annualTotalBar(years[2].cle,esgbuDisplayReport[0].cle)

    var storeStatsEsgbu = new DevExpress.data.CustomStore({
        //loadMode: "raw",
        load: function () {
            var d = new $.Deferred();
            $.get(urlStatsIndicators).done(function(results){
              var data = results.map(function(d){
                return {"count":d.count,
                        "date":d.periodeDebut.substring(0, 4),
                        "type":d.type,
                         "stats_reports":esgbuDisplayReport.filter(function(dbis){return dbis.cle.includes(d.stats_reports_id)})[0].valeur
                        }
            })
            d.resolve(data)
           })
           return d.promise();
        }
    });

    $("#selectbox-years").dxSelectBox({
        width: 150,
        items: years,
        valueExpr: "cle",
        displayExpr: "valeur",
        value: years[1].cle,
        //value: parseInt($("#selected_year").val()),
        onValueChanged: function (data) {
            $("#selected_year").val(data.value)
            return annualTotalBar($("#selected_year").val(), $("#selected_report").val())
        }
    });

    $("#selectbox-reports").dxSelectBox({
        dataSource: esgbuDisplayReport,
        valueExpr: "cle",
        displayExpr: "valeur",
        value: esgbuDisplayReport[0].cle,
        //value: $("#selected_report").val(),
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
                        var result = data.map(function(d) {
                            var costperuse = d.montant / d.count
                            return Object.assign(d, {"indicator": costperuse})
                        })
                        .sort(function (a, b) {
                            return b.count - a.count;
                        })
                        return result
                    })
            }
        });
    }

    function annualTotalBar(year,report) {
        //return getSimpleBar("totalBarChart", annualTotalReportStore(year, report), "bdd", "count", "")
        return getBarLine("totalBarChart", annualTotalReportStore(year, report), "bdd", "count", "Usage","indicator","Coût par usage","")
    }

    var pivotGridChart = $("#esgbuPivotGridChart").dxChart({
        commonSeriesSettings: {
            type: "bar"
        },
        tooltip: {
            enabled: true,
            //format: "number",
            customizeTooltip: function(args) {
            return {
                html: args.seriesName + "<div class='currency'>"
                    + valueText + "</div>"
            };
            }
        },
        size: {
            height: 200
        },
        adaptiveLayout: {
            width: 450
        }
    }).dxChart("instance");

    var pivotGrid = $("#esgbuPivotGrid").dxPivotGrid({
        allowSortingBySummary: true,
        allowFiltering: true,
        showBorders: true,
        showColumnGrandTotals: false,
        showRowGrandTotals: false,
        showRowTotals: false,
        showColumnTotals: false,
        fieldChooser: {
            enabled: true,
            height: 400
        },
        export: {
            enabled: true
        },
        dataSource: {
            fields: [{
                caption: "Type ressource",
                dataField: "stats_reports",
                dataType: "string",
                area: "row",
            }, {
                caption: "Année",
                dataField: "date",
                dataType: "string",
                area: "column",

            }, {
                caption: "Type stats",
                dataField: "type",
                dataType: "string",
                area: "column",

            },{
                caption: "Total",
                dataField: "count",
                dataType: "number",
                summaryType: "sum",
                area: "data"
            }],
            store: storeStatsEsgbu
        }
    }).dxPivotGrid("instance");

    pivotGrid.bindChart(pivotGridChart, {
        dataFieldsDisplayMode: "splitPanes",
        alternateDataFields: false
    });
})