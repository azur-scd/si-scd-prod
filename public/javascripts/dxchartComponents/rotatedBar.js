function getRotatedBar(div,store,argument,valueField1,nameField1,valueField2,nameField2,titleString){
    return  $("#"+div).dxChart({
        title: titleString,
        dataSource: store,
        rotated: true,
        barGroupWidth: 18,
        commonSeriesSettings: {
            type: "stackedbar",
            argumentField: argument
        },
        series: [{
            valueField: valueField1,
            name: nameField1,
            color: "#3F7FBF"
        }, {
            valueField: valueField2,
            name: nameField2,
            color: "#F87CCC"
        }],
        tooltip: {
            enabled: true,
            customizeTooltip: function () {
                return {
                    text: this.argumentText + " : " + this.valueText
                };
            }
        },
        valueAxis: {
            label: {
                customizeText: function () {
                    //return Math.abs(this.value) + '%';
                    return this.value
                }
            }
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            margin: { left: 50 }
        }
    });
}