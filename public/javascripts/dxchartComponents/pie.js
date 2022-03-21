function getPie(div,store,argument,value,titleString){
    return  $("#"+div).dxPieChart({
        type: "doughnut",
        palette: "bright",
        dataSource: store,
        title: titleString,
        legend: {
            orientation: "horizontal",
            itemTextPosition: "right",
            horizontalAlignment: "center",
            verticalAlignment: "bottom",
            columnCount: 4
        },
        "export": {
            enabled: true
        },
        series: [{
            argumentField: argument,
            valueField: value,
            label: {
                visible: true,
                font: {
                    size: 16
                },
                connector: {
                    visible: true,
                    width: 0.5
                },
                position: "columns",
                customizeText: function(arg) {
                    return arg.argumentText + " : " + Math.round(arg.valueText).toLocaleString() + " (" + arg.percentText + ")";
                }
            }
        }],
		onPointClick: function(e) {
            e.target.select();
        },
        onLegendClick: function(e) {
            var series = e.target;
            if(series.isVisible()) { 
                series.hide();
            } else {
                series.show();
            }
        }
    });
}