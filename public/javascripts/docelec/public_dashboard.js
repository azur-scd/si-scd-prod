$(function () {

  $("#selected_year").val(years[9].cle)
    $("#selected_report").val(esgbuDisplayReport[0].cle)
    annualTotalBar($("#selected_year").val(),$("#selected_report").val())

    var storeStatsEsgbu = new DevExpress.data.CustomStore({
        //loadMode: "raw",
        load: function () {
            var d = new $.Deferred();
            $.get(urlStatsIndicators).done(function(results){
              var data = results
                        .filter(function(d){return d.calcul_esgbu})
                        .filter(function(d){return d.calcul_esgbu[d.periodeDebut.substring(0, 4)]}) //on ne veut pas les stats annuelles des ressources pour lesquelles la case calcul_esgbu n'est pas cochée (ressource fictive type BSC+Econlit à pas compter 2 fois)
                        .map(function(d){
                           return {
							"id": d.id,
                            "count": d.count,
                            "date": d.periodeDebut.substring(0, 4),
                            "type": d.type,
                            "counter": d.counter,
                            "stats_reports": esgbuDisplayReport.filter(function (dbis) { return dbis.cle.includes(d.stats_reports_id) })[0].valeur,
                            "bdd_id": d.bdd_id,
                            "bdd": d.bdd
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
        value: parseInt($("#selected_year").val()),
        onValueChanged: function (data) {
            $("#selected_year").val(data.value)
            return annualTotalBar(data.value, $("#selected_report").val())
        }
    });

    $("#selectbox-reports").dxSelectBox({
        dataSource: esgbuDisplayReport,
        valueExpr: "cle",
        displayExpr: "valeur",
        value: $("#selected_report").val(),
        validationRules: [{
            type: "required",
            message: "Name is required"
        }],
        onValueChanged: function (data) {
            $("#selected_report").val(data.value)
            return annualTotalBar($("#selected_year").val(), data.value)
        }
    });
	
	 $("#selectbox-datagrid-years").dxSelectBox({
        width: 150,
        items: years,
        valueExpr: "cle",
        displayExpr: "valeur",
        value: parseInt($("#selected_year").val()),
        onValueChanged: function (data) {
            dataGrid.refresh();
            dataGrid.clearFilter();
            dataGrid.filter(["date", "=", data.value]);
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
            },
            {
                caption: "Counter",
                dataField: "counter",
                dataType: "string",
                area: "row",
            }, 
			{
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
	
	   var dataGrid = $("#esgbuDatagridGrid").dxDataGrid({
        dataSource: storeStatsEsgbu,
        keyExpr: 'id',
        repaintChangesOnly: true,
        showBorders: true,
        columnMaxWidth: 200,
        allowColumnResizing: true,
        columnHidingEnabled: true,
        allowColumnReordering: true,
        headerFilter: {
            visible: true
          },
          filterRow: {
            visible: true,
            applyFilter: "auto"
          },
          filterPanel: { visible: true },
        filterValue: ["date", "=", $("#selectbox-datagrid-years").dxSelectBox('instance').option('value')],
        sorting: {
            mode: "multiple"
          },
          paging: {
            pageSize: 10
          },
          pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [5, 10, 20, 50, 100],
            showInfo: true
          },
          searchPanel: {
            visible: true
        },
        groupPanel: { visible: true },
        grouping: {
            autoExpandAll: false
        },
        columns: [
            {
                dataField: "bdd",
                caption: "Ressource",
            },
            {
                dataField: "date",
                caption: "Année",
                visible: false
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
                dataField: "counter",
                caption: "Counter",
				 lookup: {
                    dataSource: statsCounter,
                    displayExpr: "valeur",
                    valueExpr: "cle"
                }
            },
            {
                dataField: "stats_reports",
                caption: "Type de statistiques",
            },
            {
                dataField: "count",
                caption: "Total usage",
                dataType: 'number',
                alignment: 'left'
            },
        ]
    }).dxDataGrid("instance")
})