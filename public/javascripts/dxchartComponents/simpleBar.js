function getSimpleBar(div,store,argument,valueField,titleString){
    return  $("#"+div).dxChart({
        dataSource: store, 
        series: {
            argumentField: argument,
            valueField: valueField,
            name: "Totaux",
            type: "bar",
            color: '#ffaa66',
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