function getGroupedBar(div,store,argument,series,titleString){
    return  $("#"+div).dxChart({
        dataSource: store,
        commonSeriesSettings: {
            argumentField: argument,
            type: "bar",
            barPadding: 0.05,
            hoverMode: "allArgumentPoints",
            selectionMode: "allArgumentPoints"
        },
        series: series,
        title: titleString,
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                displayMode: "rotate",
                rotationAngle: -45,
                indentFromAxis: 2
            }
        },
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                return {
                    text: arg.argumentText + "/" + arg.seriesName + " : " + arg.valueText
                };
            }
        },
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