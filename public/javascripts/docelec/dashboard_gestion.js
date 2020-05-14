$(function(){
    var urlBdd = "./api/bdds"
    var urlGestion = "./api/bdds_gestion"
    var store = new DevExpress.data.CustomStore({
        loadMode: "raw",
        load: function() {
            return $.getJSON(urlGestion);
        }
    });
    var barDataSource = new DevExpress.data.DataSource({
        store:store,
        filter: ["annee", "=", 2020],
        postProcess: function(results) {
            return getGroupSum(results,"etat","montant_ttc");
        }
    });

    var pieDataSource = new DevExpress.data.DataSource({
        store:store,
        filter: [["annee", "=", 2020],"and", [
            [ "etat", "notcontains", "1" ],
            "and", 
            [ "etat", "notcontains", "2" ]
        ]],
        postProcess: function(results) {
            return getGroupCount(results,"etat");
        }
    });
    
    var groupBarDataSource = new DevExpress.data.DataSource({
        store:store,
        filter: ["annee", "=", 2020],
        postProcess: function(results) {
            console.log(groupBy(results))
            return groupBy(results);
        }
    });

    var barChartOptions = {
        dataSource: barDataSource,
        palette: "soft",
        title: {
            text: "Montants TTC"
        },
        size: {
            width: 500,
            height: 420
        },
        commonPaneSettings: {
            border: {
                visible: true,
                width: 2,
                top: false,
                right: false
            }
        },
        "export": {
            enabled: true
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (arg) {
                return {
                    text: arg.valueText + "euros"
                };
            }
        },
        commonSeriesSettings: {
            type: "bar",
            valueField: "value",
            argumentField: "key",
            ignoreEmptyPoints: true
        },
        seriesTemplate: {
            nameField: "key"
        }
    };
    
    var pieChartOptions = {
        palette: "bright",
        dataSource: pieDataSource,
        title: { 
            text: "Nombre de ressources",
            subtitle: {
                text: "Estimé vs facturé"
            }
        },
        size: {
            width: 500,
            height: 420
        },
        legend: {
            visible: false
        },
        animation: {
            enabled: true
        },
        resolveLabelOverlapping: "shift",
        "export": {
            enabled: true
        },
        series: [{
            argumentField: "key",
            valueField: "value",
            label: {
                visible: true,
                connector: {
                    visible: true,
                    width: 0.5
                },
                customizeText: function(arg) {
                    return arg.argumentText + " : "+ arg.valueText + " (" + arg.percentText + ")";
                }
            }
        }]
    }

    var groupBarChartOptions = {
        dataSource: groupBarDataSource,
        commonSeriesSettings: {
            argumentField: "bdd",
            type: "bar",
            size: {
                width: 1200
                //height: 420
            },
            hoverMode: "allArgumentPoints",
            selectionMode: "allArgumentPoints",
            label: {
                visible: true,
                format: {
                    type: "fixedPoint",
                    precision: 0
                }
            }
        },
        series: [
            { valueField: "1-prev", name: "Prévisionnel" }
        ],
        title: "Synthèse par ressource",
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        onPointClick: function (e) {
            e.target.select();
        }
    }
    $("#barChart").dxChart(barChartOptions);
    $("#pieChart").dxPieChart(pieChartOptions);
    $("#groupBarChart").dxChart(groupBarChartOptions);

    $("#selectbox").dxSelectBox({
        width: 150,
        items: years,
        value: 2020,
        valueExpr: "cle",
        displayExpr: "valeur",
        onValueChanged: function(data) {
            barDataSource.filter(["annee", "=", data.value]);barDataSource.load();
            pieDataSource.filter(["annee", "=", data.value]);pieDataSource.load();
            groupBarDataSource.filter(["annee", "=", data.value]);groupBarDataSource.load();
        }
    });
  /*function getGroupCount(data) {
    var agg = _.reduce(data, function(memo,item) {
        memo[item.etat] = (memo[item.etat] || 0) + item.montant_ttc;
        return memo;
    }, {})
    var barData = []
    Object.keys(agg).forEach(function(key){
    var value = agg[key];
    barData.push({"etat":key,'sum':value})});
    console.log(barData)
    return barData;
    }*/

})