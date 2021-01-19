$(function(){
google.charts.setOnLoadCallback( function(){
    browser = new kshf.Browser({
      domID: "#demo_Browser",
      barChartWidth: 100,
      categoryTextWidth: 160,
      leftPanelLabelWidth: 150,
        rightPanelLabelWidth: 150,
        source: {
            gdocId: '12W2pOyeK_k7Gyu0gkDIenHLY9byE3dEmtt1CzEDO9Uc',
            tables: "IUBAll"
          },
      summaries: [       
        {
          "name": "Niveau",
          "panel": "left",
          "value": function () {
            return this.niveau
         }
        },
        {
          "name": "Discipline",
          "panel": "left",
          "value": function () {
            return this.discipline
         }
        },
       {
          "name": "Année",
          "panel": "middle",
          "value": function () {
            return parseInt(this.annee)
         }
        },
        {
          "name": "Bibliothèque",
          "panel": "middle",
          "value": function () {
            return this.bib
         }
        },
       /* {
          "name": "Temps de réponse",
          "panel": "middle",
          "value": function () {
            return this["temps de reponse"]
         }
        },*/
        {
          "name": "Type de question",
          "panel": "right",
          "value": function () {
            return this["type de question (fine)"]
         }
        },
        {
          "name": "Répondant",
          "panel": "right",
          "value": function () {
            return this.repondant
         }
        },
        {
          "name": "Date",
          "panel": "bottom",
          timeFormat: "%d/%m/%Y",
          "value": function () {
            return this.date
         }
        },
       /* {
          "name": "Délai de réponse (en jours)",
          "panel": "middle",
          "value": function () {
            var dateQ = moment(this.date, 'DD-MM-YYYY',true); 
            var dateR = moment(this["date reponse"], 'DD-MM-YYYY',true);
            console.log(dateR.diff(dateQ, 'days'))
            return parseInt(dateR.diff(dateQ, 'days'))
         }
        },*/
      ]
    });
    });
  })