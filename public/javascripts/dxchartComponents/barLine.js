function getBarLine(div,store,barArgument,barValueField,barSerieName,lineValueField,lineSerieName,titleString){
    return  $("#"+div).dxChart({
        palette: "vintage",
        dataSource: store,
		size: {
            height: 600
        },
        commonSeriesSettings:{
            argumentField: barArgument,
            valueField: barValueField,
            type: "bar"
        },
        series: [{
                valueField: barValueField,
                name: barSerieName
            }, {
                axis: "total",
                type: "line",
                valueField: lineValueField,
                name: lineSerieName,
                color: "#008fd8"
            }
        ],
        valueAxis: [{
            grid: {
                visible: true
            }
        }, {
            name: "total",
            position: "right",
            grid: {
                visible: true
            },
            title: {
               // text: "Total Population, billions"
            }
        }],
        argumentAxis: { // or valueAxis, or commonAxisSettings
            label: {
                displayMode: "rotate",
                rotationAngle: -45,
                indentFromAxis: 2
            }
        },
         tooltip: {
            enabled: true,
            shared: true,
            format: {
                type: "largeNumber",
                precision: 1
            },
            contentTemplate: function(arg) {
                var items = arg.valueText.split("\n"),
                    series = arg.argumentText.split("\n");
                return "<div class='state-tooltip'>" +
                "<div><span class='caption'>"+series[0]+"</span>: " +
                "</div><div>" +
                items.join("\n") +
                "</div></div>";
            }
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: {
            text: titleString
        }
    })
}