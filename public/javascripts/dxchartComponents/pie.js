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
                    return arg.argumentText + " : " + arg.valueText + " (" + arg.percentText + ")";
                }
            }
        }]
    });
}