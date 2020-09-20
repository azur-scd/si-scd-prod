function getStackedBar(div,store,argument,series,titleString){
    return  $("#"+div).dxChart({
        dataSource: store,
        commonSeriesSettings: {
            argumentField: argument,
            type: "stackedBar"
        },
        series: series,
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            itemTextPosition: 'top'
        },
        valueAxis: {
            position: "right"
        },
        title: titleString,
        "export": {
            enabled: true
        },
        customizeLabel: function () {
                return {
                    visible: true,
                    backgroundColor: "#8c8cff",
                    customizeText: function () {
                        return Math.round(this.valueText).toLocaleString();
                    }
                };  
        },
        tooltip: {
            enabled: true,
            location: "edge",
            contentTemplate: function(arg) {
                return "<div class='state-tooltip'>" +
                "<div><span class='caption'>Série</span>: " +
                arg.seriesName +
                "</div><div><span class='caption'>Valeur</span>: " +
                Math.round(arg.valueText).toLocaleString() + " (" + arg.percentText + ")" +
                "</div>" + "</div>";
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