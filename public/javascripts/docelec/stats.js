$(function(){
   
    getFormData($("#selected_year").val(),$("#selected_bdd").val(),$("#selected_report").val())
    annualTotalBar($("#selected_bdd").val(),$("#selected_report").val())
    monthTotalLine($("#selected_year").val(),$("#selected_bdd").val(),$("#selected_report").val())
    indicators($("#selected_bdd").val(),$("#selected_report").val())

    var storeBdd = new DevExpress.data.CustomStore({
        loadMode: "raw",
        load: function() {
            //return $.getJSON(urlBdd);
            return getItems(urlBdd)
        }
    });

    var storeStatsReports = new DevExpress.data.CustomStore({
        loadMode: "raw",
        load: function() {
            return getItems(urlStatsReports);
        }
    }); 

    $("#selectbox-years").dxSelectBox({
        width: 150,
        items: years,
        valueExpr: "cle",
        displayExpr: "valeur",
        value: parseInt($("#selected_year").val()),
        onValueChanged: function(data) {
            $("#selected_year").val(data.value)
            return getFormData($("#selected_year").val(),$("#selected_bdd").val(),$("#selected_report").val()),
                   monthTotalLine($("#selected_year").val(),$("#selected_bdd").val(),$("#selected_report").val())
        }
    });
    
    $("#selectbox-bdd").dxSelectBox({
        dataSource: storeBdd,
        valueExpr: "id",
        displayExpr: "bdd",
        value: parseInt($("#selected_bdd").val()),
        searchEnabled:true, 
        isRequired: true, 
        onValueChanged: function(data) {
            $("#selected_bdd").val(data.value)
            return getFormData($("#selected_year").val(),$("#selected_bdd").val(),$("#selected_report").val()),
                   annualTotalBar($("#selected_bdd").val(),$("#selected_report").val()),
                   monthTotalLine($("#selected_year").val(),$("#selected_bdd").val(),$("#selected_report").val())
        }
    }).dxValidator({  
        validationRules: [{ type: 'required' }]  
    });

    $("#selectbox-reports").dxSelectBox({
        dataSource: storeStatsReports,
        valueExpr: "id",
        displayExpr: "mesure",
        value: parseInt($("#selected_report").val()),
        validationRules: [{
            type: "required",
            message: "Name is required"
        }],
        onValueChanged: function(data) {
            $("#selected_report").val(data.value)
            return getFormData($("#selected_year").val(),$("#selected_bdd").val(),$("#selected_report").val()),
                   annualTotalBar($("#selected_bdd").val(),$("#selected_report").val()),
                   monthTotalLine($("#selected_year").val(),$("#selected_bdd").val(),$("#selected_report").val())
        }
    });

    $("#insertFormData").click(function(){       
        months.map(function(m){
            if($("#id_"+m.cle).val() != '') {
                return updateItems(urlStats,$("#id_"+m.cle).val(),{"count":$("#"+m.cle).val()});
            }
            else if(($("#id_"+m.cle).val() == '') && ($("#"+m.cle).val() != 0)) {
            var monthDataToInsert = {"bdd_id":$("#selected_bdd").val(),
                         "stats_reports_id": $("#selected_report").val(),
                         "periodeDebut": $("#selected_year").val()+m.start,
                         "periodeFin": $("#selected_year").val()+m.end,
                         "count" : $("#"+m.cle).val(),
                         "dimension": m.cle }
            return createItems(urlStats,monthDataToInsert)
            }
        })
        return getFormData($("#selected_year").val(),$("#selected_bdd").val(),$("#selected_report").val())
    })

    function getFormData(year,bdd,report) {
        //cleanIds();
        $("#form").empty()
        displayForm();
        return getItems(urlFormStats+"/?bddId="+bdd+"&reportId="+report+"&year="+year)
        .done(function(data) {
            if(typeof year !== "undefined" && typeof bdd !== "undefined" && typeof report !== "undefined" && data.length != 0) {
                $("#alertData").hide()
                months.map(function(m){
                    var filterDataByMonth = data.filter(function(i){return i.dimension === m.cle});
                    if(filterDataByMonth.length != '0') {
                        $("#"+m.cle).val(filterDataByMonth[0].count);
                        $("#id_"+m.cle).val(filterDataByMonth[0].id);
                    }
                    else {
                        return $("#"+m.cle).val(0); 
                    }
                })
            }
            else if(typeof year !== "undefined" && typeof bdd !== "undefined" && typeof report !== "undefined" && data.length == 0) {
                $("#alertData").show()
                months.map(function(m){
                    return $("#"+m.cle).val(0); 
                }) 
            }
              /*var store = data.map(function(d){
               var memo = {}
                  memo[d.dimension] = d.count;
                return memo;          
            })*/   
                       
        })
    }
    function displayForm(){
        // $("#form").empty()
        months.map(function(m){
            $("#form").append("<div class='form-group'><label for='"+m.cle+"' class='control-label col-md-4'>"+m.valeur+"</label><div class='col-md-6'><input type='text' class='form-control' id='"+m.cle+"' /><input type='hidden' id='id_"+m.cle+"' value='' /></div></div>")
        })
    }
    
    function annualTotalStore(bdd,report) {
        return new DevExpress.data.CustomStore({
            key: "id",
            load: function () {
               return getItems(urlStats+"?bdd_id="+bdd+"&stats_reports_id="+report+"&dimension=total")
                      .then(function(data){
                        var result =  data.map(function(d){
                              return {"date":d.periodeDebut.substring(0, 4),"total":d.count}
                          })
                          .sort(function(a,b){ 
                            return a.date - b.date;
                           })
                          return result
                      })					
                    }     
        });
    }

    function monthlyTotalStore(year,bdd,report) {
        return new DevExpress.data.CustomStore({
            key: "id",
            load: function () {
               return getItems(urlStats+"/bddid/"+bdd)
                      .then(function(data){
                        var sortingMonths = months.map(function(d){return d.cle})
                        var result =  data
                        .filter(function(d){
                            return d.stats_reports_id == report && d.periodeDebut.substring(0, 4) == year && d.dimension != "total"
                        })
                        .map(function(d){
                              return {"mois":d.dimension,"total":d.count}
                          })
                        .sort(function(a, b){ 
                            return sortingMonths.indexOf(a.mois) - sortingMonths.indexOf(b.mois);
                        });
                          return result
                      })					
                    }     
        })
    }
    function gestionData(bdd){
        return new DevExpress.data.CustomStore({
            key: "id",
            load: function () {
               return getItems(urlGestion+"/bddid/"+bdd)
                      .then(function(data){
                        var result = data
                        .filter(function(d){
                            return d.etat == "4-facture"
                        })
                        .map(function(d){
                              return {"date":d.annee,"cout":d.montant_ttc}
                          })
                        .sort(function(a,b){ 
                            return a.date - b.date;
                        });
                          return result
                      })					
                 }     
        })
    }
    
    function annualTotalBar(bdd,report){
        return getSimpleBar("totalBarChart",annualTotalStore(bdd,report),"date","total","")
    }

    function monthTotalLine(year,bdd,report){
        var series = [{ valueField: "total", name: "Total" }]
        return getSimpleLine("monthLineChart",monthlyTotalStore(year,bdd,report),"mois",series,"")
    }
    
    function indicators(bdd,report) {
        console.log(annualTotalStore(bdd,report))
        console.log(gestionData(bdd))
    }
    function cleanIds(){
        $("input[id^=id_]").each(function(){
            if ($(this).val() != '') {           
               deleteItems(urlStats,$(this).val());
            }
        })
    }
     /*unused functions
    $("#submitSelected").click(function(){
        getFormData($("#selected_year").val(),$("#selected_bdd").val(),$("#selected_report").val())
    })
    $("#updateFormData").click(function(){
        months.map(function(m){
            if($("#"+m.cle).val() != 0) {
            return updateItems(urlStats,$("#id_"+m.cle).val(),{"count":$("#"+m.cle).val()});
            }
        })
        return getFormData($("#selected_year").val(),$("#selected_bdd").val(),$("#selected_report").val())
    })*/
})