function getSimpleLine(div,store,argument,series,titleString){
    return   $("#"+div).dxChart({
        dataSource: store, 
        palette: "Violet",
        commonSeriesSettings: {
            argumentField: argument,
            type: "line"
        },
        series: series,
        title: titleString,
        "export": {
            enabled: true
        },
        tooltip: {
            enabled: true,
            location: "edge",
            contentTemplate: function(arg) {
                return "<div class='state-tooltip'>" +
                "<div><span class='caption'>Série</span>: " +
                arg.argumentText + 
                "</div><div><span class='caption'>Valeur</span>: " +
                arg.valueText +
                "</div>" + "</div>";
            }
        },
    });
}