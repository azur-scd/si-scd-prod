function getClusteredBar(div,data,titleString){
    am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        // Create chart instance
        var chart = am4core.create(div, am4charts.XYChart);
        
        
        // Add data
        chart.data = data;
        
        //creta title
        var title = chart.titles.create();
        title.text = titleString;
        title.fontSize = 25;
        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "state";
        categoryAxis.renderer.grid.template.location = 0;
        
        
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.disabled = true;
        valueAxis.min = 0;
        
        // Create series
        function createSeries(field, name) {
          
          // Set up series
          var series = chart.series.push(new am4charts.ColumnSeries());
          series.name = name;
          series.dataFields.valueY = field;
          series.dataFields.categoryX = "state";
          series.sequencedInterpolation = true;
          
          // Make it stacked
          series.stacked = true;
          
          // Configure columns
          series.columns.template.width = am4core.percent(60);
          series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
          
          // Add label
          var labelBullet = series.bullets.push(new am4charts.LabelBullet());
          labelBullet.label.text = "{valueY}";
          labelBullet.locationY = 0.5;
          labelBullet.label.hideOversized = true;
          
          return series;
        }
        
        createSeries("budgete", "Budgete");
        createSeries("estime", "Estimé");
        createSeries("facture", "Facturé");
        
        // Legend
        chart.legend = new am4charts.Legend();
        
        }); // end am4core.ready()
}