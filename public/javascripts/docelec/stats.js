$(function () {
	
    if ($('#usergroup').val() == "guest") {
      $(".panel-footer").hide()
    }
	
    getAvalaibleReports($("#selected_bdd").val())
    getFormData($("#selected_year").val(), $("#selected_bdd").val(), $("#selected_report").val())
    getSushiParam($("#selected_bdd").val())
    annualTotalBar($("#selected_bdd").val(), $("#selected_report").val())
    monthTotalLine($("#selected_year").val(), $("#selected_bdd").val(), $("#selected_report").val())
    indicators($("#selected_bdd").val(), $("#selected_report").val())

    var storeBdd = new DevExpress.data.CustomStore({
        loadMode: "raw",
        load: function () {
            var d = new $.Deferred();
            $.get(urlBdd).done(function(results){
              var data = results
                        .filter(function(d){
                            return d.stats_collecte[$("#selectbox-years").dxSelectBox('instance').option('value')]
                        }) // affiche les bdds du menu déroulant si la adte sélectionnée est cochée dans le json stats_collecte
                       
            d.resolve(data)
           })
           return d.promise();
        }
    });

    var storeStats = new DevExpress.data.CustomStore({
        key: "id",
        load: function () {
            return getItems(urlStats)
        },
        update: function (key, values) {
            return updateItems(urlStats, key, values);
        },
        insert: function (values) {
            return createItems(urlStats, values);
        },
        remove: function (key) {
            return deleteItems(urlStats, key);
        }
    });

    var storeStatsReports = new DevExpress.data.CustomStore({
        loadMode: "raw",
        load: function () {
            return getItems(urlStatsReports);
        }
    });

    $("#selectbox-years").dxSelectBox({
        width: 150,
        items: years,
        valueExpr: "cle",
        displayExpr: "valeur",
        value: parseInt($("#selected_year").val()),
        onValueChanged: function (data) {
            $("#selected_year").val(data.value)
            $("#selectbox-bdd").dxSelectBox("getDataSource").reload(); // reload du select bdds en fonction de l'année sélectionnée
            return getFormData($("#selected_year").val(), $("#selected_bdd").val(), $("#selected_report").val()),
                monthTotalLine($("#selected_year").val(), $("#selected_bdd").val(), $("#selected_report").val())
        }
    });

    $("#selectbox-bdd").dxSelectBox({
        dataSource: storeBdd,
        valueExpr: "id",
        displayExpr: "bdd",
        value: parseInt($("#selected_bdd").val()),
        searchEnabled: true,
        isRequired: true,
        onValueChanged: function (data) {
            $("#selected_bdd").val(data.value)
            return getAvalaibleReports($("#selected_bdd").val()),
			    getFormData($("#selected_year").val(), $("#selected_bdd").val(), $("#selected_report").val()),
                annualTotalBar($("#selected_bdd").val(), $("#selected_report").val()),
                monthTotalLine($("#selected_year").val(), $("#selected_bdd").val(), $("#selected_report").val()),
                getSushiParam($("#selected_bdd").val())
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
        onValueChanged: function (data) {
            $("#selected_report").val(data.value)
            return getFormData($("#selected_year").val(), $("#selected_bdd").val(), $("#selected_report").val()),
                annualTotalBar($("#selected_bdd").val(), $("#selected_report").val()),
                monthTotalLine($("#selected_year").val(), $("#selected_bdd").val(), $("#selected_report").val())
        }
    });

    $("#insertFormData").click(function () {
        months.map(function (m) {
            if ($("#id_" + m.cle).val() != '') {
                return updateItems(urlStats, $("#id_" + m.cle).val(), { "count": $("#" + m.cle).val() });
            }
            else if (($("#id_" + m.cle).val() == '') && ($("#" + m.cle).val() != 0)) {
                var monthDataToInsert = {
                    "bdd_id": $("#selected_bdd").val(),
                    "stats_reports_id": $("#selected_report").val(),
                    "periodeDebut": $("#selected_year").val() + m.start,
                    "periodeFin": $("#selected_year").val() + m.end,
                    "count": $("#" + m.cle).val(),
                    "dimension": m.cle
                }
                return createItems(urlStats, monthDataToInsert)
            }
        })
        return getFormData($("#selected_year").val(), $("#selected_bdd").val(), $("#selected_report").val()),
            annualTotalBar($("#selected_bdd").val(), $("#selected_report").val()),
            monthTotalLine($("#selected_year").val(), $("#selected_bdd").val(), $("#selected_report").val())
    })

    $("#calculateTotal").click(function () {
        return calculateSum()
    })
	
	 function getAvalaibleReports(bdd){
        $("#avalaibleReports").empty()
        return getItems(urlBddUniqueStatsReports + "/bddid/" + bdd)
        .done(function (result) {
            console.log(result)
            $("#avalaibleReports").append("Statistiques disponibles (déjà collectées) pour cette ressource : ")
            result.map(function(d){return $("#avalaibleReports").append("<span class='label label-danger label-form' style='margin-right:5px;'>"+d.StatReport.mesure+"</span>")})
        })
    }

    function getFormData(year, bdd, report) {
        //cleanIds();
        $("#form").empty()
        displayForm();
        return getItems(urlFormStats + "/?bddId=" + bdd + "&reportId=" + report + "&year=" + year)
            .done(function (data) {
                if (typeof year !== "undefined" && typeof bdd !== "undefined" && typeof report !== "undefined" && data.length != 0) {
                    $("#alertData").hide()
                    months.map(function (m) {
                        var filterDataByMonth = data.filter(function (i) { return i.dimension === m.cle });
                        if (filterDataByMonth.length != '0') {
                            $("#" + m.cle).val(filterDataByMonth[0].count);
                            $("#id_" + m.cle).val(filterDataByMonth[0].id);
                        }
                        else {
                            return $("#" + m.cle).val(0);
                        }
                    })
                }
                else if (typeof year !== "undefined" && typeof bdd !== "undefined" && typeof report !== "undefined" && data.length == 0) {
                    $("#alertData").show()
                    months.map(function (m) {
                        return $("#" + m.cle).val(0);
                    })
                }
            })
    }
    function displayForm() {
        // $("#form").empty()
        months.map(function (m) {
            $("#form").append("<div class='form-group'><label for='" + m.cle + "' class='control-label col-md-4'>" + m.valeur + "</label><div class='col-md-6'><input type='text' class='form-control' id='" + m.cle + "' /><input type='hidden' id='id_" + m.cle + "' value='' /></div></div>")
        })
    }

    function calculateSum() {
        var sum = 0;
        //iterate through each textboxes and add the values
        $("#janvier,#fevrier,#mars,#avril,#mai,#juin,#juillet,#aout,#septembre,#octobre,#novembre,#decembre").each(function () {
            //add only if the value is number
            if (!isNaN(this.value) && this.value.length != 0) {
                sum += parseInt(this.value);
            }
        });
        //final sum
        $("#total").val(sum);
    }

    function getSushiParam(id) {
        return getItems(urlBdd + "/" + id)
            .done(function (result) {
                /* on remet ici les valeurs de l'array sushiReportUrlSegment car blocage dans l'UI sinon ?*/
                 var sushiReportUrlSegment = [
                { "cle": "0-tr_j1", "metric":"Total_Item_Requests","valeur": "Revues - Téléchargements (tr_j1) - Total Item Requests", "mapReportId": 1 },
                { "cle": "1-tr_j1",  "metric":"Unique_Item_Requests", "valeur": "Revues - Téléchargements (tr_j1) - Unique Item Requests", "mapReportId": 8 },
                { "cle": "2-tr_b1",  "metric":"Total_Item_Requests", "valeur": "Ebooks - Téléchargements (tr_b1)  - Total Item Requests", "mapReportId": 1 },
                { "cle": "3-tr_b1",  "metric":"Unique_Item_Requests", "valeur": "Ebooks - Téléchargements (tr_b1)  - Unique Item Requests", "mapReportId": 8 },
                { "cle": "4-pr_p1",  "metric":"Searches_Platform","valeur": "Plateformes - Recherches (pr_p1)", "mapReportId": 4 },
                { "cle": "5-pr_p1", "metric":"Total_Item_Requests","valeur": "Plateformes - Téléchargements (pr_j1) - Total Item Requests", "mapReportId": 1 },
                { "cle": "6-pr_p1",  "metric":"Unique_Item_Requests", "valeur": "Plateformes - Téléchargements (pr_p1) - Unique Item Requests", "mapReportId": 8 },
                { "cle": "7-tr_j2",  "metric":"Total_Item_Requests", "valeur": "Revues - Refus d'accès (tr_j2)", "mapReportId": 3 },       
                { "cle": "8-tr_b2",  "metric":"Total_Item_Requests", "valeur": "Ebooks - Refus d'accès (tr_b2)", "mapReportId": 3 },
                { "cle": "9-dr_d1", "valeur": "Base de données - Recherches (dr_d1)", "mapReportId": 4 },
                ]
                if (result.stats_get_mode == "sushi") {
                    $("#sushiPanel").show()
                    $("#resourceSushiUrl").val(result.stats_url_sushi);
                    $("#resourceRequestorId").val(result.sushi_requestor_id);
                    $("#resourceCustomerId").val(result.sushi_customer_id);
                    $("#resourceApiKey").val(result.sushi_api_key);
                    $("#selectbox-sushi-reports").dxSelectBox({
                        width: 250,
                        items: sushiReportUrlSegment,
                        valueExpr: "cle",
                        displayExpr: "valeur",
                        value: $("#selected_sushi_report").val(),
                        onValueChanged: function (data) {
                            $("#selected_sushi_report").val(data.value.split("-")[1])
                            $("#selected_metric").val(sushiReportUrlSegment.filter(function (d) { return d.cle == data.value })[0].metric)
                            createSushiUrl($("#beginSushiDate").val(), $("#endSushiDate").val(), $("#selected_sushi_report").val())
                            var reportId = sushiReportUrlSegment.filter(function (d) { return d.cle == data.value })[0].mapReportId
                            $("#selectbox-reports")  
                               .dxSelectBox("instance")  
                               .option("value", reportId); 
                        }
                    });
                    $("#sushi-start").dxDateBox({
                        type: "date",
                        showClearButton: true,
                        useMaskBehavior: true,
                        displayFormat: 'yyyy-MM-dd',
                        value: $("#beginSushiDate").val(),
                        onValueChanged: function (data) {
                            var date = formatingDate(data.value)
                            $("#beginSushiDate").val(date)
                            //$("#beginSushiDate").val(data.value.toISOString().substring(0, 10)); 
                            createSushiUrl($("#beginSushiDate").val(), $("#endSushiDate").val(), $("#selected_sushi_report").val())
                            $("#selectbox-years")  
                            .dxSelectBox("instance")  
                            .option("value", parseInt(date.split("-")[0])); 
                        }
                    });
                    $("#sushi-end").dxDateBox({
                        type: "date",
                        showClearButton: true,
                        useMaskBehavior: true,
                        displayFormat: 'yyyy-MM-dd',
                        value: $("#endSushiDate").val(),
                        onValueChanged: function (data) {
                            $("#endSushiDate").val(formatingDate(data.value))
                            createSushiUrl($("#beginSushiDate").val(), $("#endSushiDate").val(), $("#selected_sushi_report").val())
                        }
                    });
                }
                else {
                    $("#sushiPanel").hide()
                }
            })
    }

    function createSushiUrl(start, end, sushi_url_segment) {
        var obj = {}; var resourceSushi; var completeUrl;

        if ($("#resourceSushiUrl").val().endsWith("/")) {
            resourceSushi = $("#resourceSushiUrl").val() + "reports/" + sushi_url_segment
        }
        else {
            resourceSushi = $("#resourceSushiUrl").val() + "/reports/" + sushi_url_segment
        }
        if ($("#resourceRequestorId").val() != "") {
            obj["requestor_id"] = $("#resourceRequestorId").val()
        }
        if ($("#resourceCustomerId").val() != "") {
            obj["customer_id"] = $("#resourceCustomerId").val()
        }
        if ($("#resourceApiKey").val() != "") {
            obj["api_key"] = $("#resourceApiKey").val()
        }
        obj["begin_date"] = start
        obj["end_date"] = end
        completeUrl = resourceSushi + "?" + getDataEncoded(obj)
        return $("#completeSushiUrl").val(completeUrl)
        //return completeUrl
    }

    $("#testSushi").click(function () {
        var completeUrl = $("#completeSushiUrl").val()
        console.log(completeUrl)
        var reportId = sushiReportUrlSegment.filter(function (d) { return d.cle = $("#selected_sushi_report").val() }).map(function (d) { return d.mapReportId })
        return $.ajax({
            method: 'POST',
            url: urlProxySushiTest,
            //headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: { "url": completeUrl, "metric" : $("#selected_metric").val() },
            beforeSend: function() {
                $("#loaderDiv").show();
            },
            success: function (response) {
                $("#loaderDiv").hide();
                alert(JSON.stringify(response))
            },
            //error : function(response) {console.log(response.statusText);}
            error: function (response) { console.log(response); alert(response.statusText); }
        })
    })

    $("#getSushi").click(function () {
        var completeUrl = $("#completeSushiUrl").val()
        console.log(completeUrl)
        var reportId = sushiReportUrlSegment.filter(function (d) { return d.cle = $("#selected_sushi_report").val() }).map(function (d) { return d.mapReportId })
        return $.ajax({
            method: 'POST',
            url: urlProxySushi + $("#selected_sushi_report").val(),
            data: { "url": completeUrl, , "metric" : $("#selected_metric").val() },
            beforeSend: function() {
                $("#loaderDiv").show();
            },
            success: function (response) {
                //console.log(response)
                $("#loaderDiv").hide();
                months.map(function (m) {
                    var filterDataByMonth = response.filter(function (i) { return i.dimension === m.code });
                    console.log(filterDataByMonth)
                    if (filterDataByMonth.length != '0') {
                        $("#" + m.cle).val(filterDataByMonth[0].count);
                    }
                })
            },
            //error : function(response) {console.log(response.statusText);}
            error: function (response) { console.log(response); alert(response.statusText); }
        })
    })

    function annualTotalStore(bdd, report) {
        return new DevExpress.data.CustomStore({
            key: "id",
            load: function () {
                return getItems(urlStats + "?bdd_id=" + bdd + "&stats_reports_id=" + report + "&dimension=total")
                    .then(function (data) {
                        var result = data.map(function (d) {
                            return { "date": d.periodeDebut.substring(0, 4), "total": d.count }
                        })
                            .sort(function (a, b) {
                                return a.date - b.date;
                            })
                        return result
                    })
            }
        });
    }

    function monthlyTotalStore(year, bdd, report) {
        return new DevExpress.data.CustomStore({
            key: "id",
            load: function () {
                return getItems(urlStats + "/bddid/" + bdd)
                    .then(function (data) {
                        var sortingMonths = months.map(function (d) { return d.cle })
                        var result = data
                            .filter(function (d) {
                                return d.stats_reports_id == report && d.periodeDebut.substring(0, 4) == year && d.dimension != "total"
                            })
                            .map(function (d) {
                                return { "mois": d.dimension, "total": d.count }
                            })
                            .sort(function (a, b) {
                                return sortingMonths.indexOf(a.mois) - sortingMonths.indexOf(b.mois);
                            });
                        return result
                    })
            }
        })
    }
    function gestionData(bdd) {
        return new DevExpress.data.CustomStore({
            key: "id",
            load: function () {
                return getItems(urlGestion + "/bddid/" + bdd)
                    .then(function (data) {
                        var result = data
                            .filter(function (d) {
                                return d.etat == "4-facture"
                            })
                            .map(function (d) {
                                return { "date": d.annee, "cout": d.montant_ttc }
                            })
                            .sort(function (a, b) {
                                return a.date - b.date;
                            });
                        return result
                    })
            }
        })
    }

    function annualTotalBar(bdd, report) {
        return getSimpleBar("totalBarChart", annualTotalStore(bdd, report), "date", "total", "")
    }

    function monthTotalLine(year, bdd, report) {
        var series = [{ valueField: "total", name: "Total" }]
        return getSimpleLine("monthLineChart", monthlyTotalStore(year, bdd, report), "mois", series, "")
    }

    function indicators(bdd, report) {
        //console.log(annualTotalStore(bdd,report))
        //console.log(gestionData(bdd))
    }
    function cleanIds() {
        $("input[id^=id_]").each(function () {
            if ($(this).val() != '') {
                deleteItems(urlStats, $(this).val());
            }
        })
    }
})