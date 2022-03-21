function getSimpleBar(div,store,argumentField,valueField,colorField,titleString){
    return  $("#"+div).dxChart({
         dataSource: store, 
        commonSeriesSettings: {
            argumentField: argumentField,
            valueField: valueField,
            type: "bar",
            ignoreEmptyPoints: true,
        },
        seriesTemplate: {
            nameField: colorField,
          },
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
    })
}