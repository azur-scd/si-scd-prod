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
            customizeTooltip: function (arg) {
                var items = arg.valueText.split("\n"),
                    color = arg.point.getColor();
                $.each(items, function(index, item) {
                    if(item.indexOf(arg.seriesName) === 0) {
                        items[index] = $("<span>")
                                        .text(item)
                                        .addClass("active")
                                        .css("color", color)
                                        .prop("outerHTML");
                    }
                });
                return { text: items.join("\n") };
            }
        },
       /* tooltip: {
            enabled: true,
            location: "edge",
            contentTemplate: function(arg) {
                return "<div class='state-tooltip'>" +
                "<div>" +
                arg.argumentText + 
                "</div><div><span class='caption'>Valeur</span>: " +
                arg.valueText +
                "</div>" + "</div>";
            }
        },*/
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