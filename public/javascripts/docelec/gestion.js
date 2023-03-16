$(function(){
	
	let editMode = true;
    if ($('#usergroup').val() == "guest") {
    editMode = false
}

    var storeBdds = new DevExpress.data.CustomStore({  
        key: "id",
        loadMode: "raw",
        cacheRawData: false,
        load: function () {
            var d = new $.Deferred();
            $.get(urlBdd).done(function(results){
              var data = results
                        .filter(function(d){
                            return d.gestion[$("#selectbox").dxSelectBox('instance').option('value')] // on 'affiche que les ressources qui ont l'année selectionnée cochée en gestion
                        }) 
                       
            d.resolve(data)
           })
           return d.promise();
        } 
      })  
   
    var storeGestion = new DevExpress.data.CustomStore({
        key: "id",
        load: function () {
           return getItems(urlGestionCustom)					
                },
        update: function(key, values) {
			return updateItems(urlGestion,key,values);
        },
        insert: function(values) {
            return createItems(urlGestion,values);
        },  
        remove: function(key) {
            return deleteItems(urlGestion,key);
        }      
    });

    var isNextBudgete = function(etat) {
        return etat && ["2-budgete", "4-facture","3-estime"].indexOf(etat.trim()) >= 0;
      };
    var isNextEstime = function(etat) {
        return etat && ["1-prev", "4-facture","3-estime"].indexOf(etat.trim()) >= 0;
      };
    var isNextFacture = function(etat) {
        return etat && ["1-prev", "4-facture","3-estime"].indexOf(etat.trim()) >= 0;
     };
    var isNextEstime2Facture = function(etat) {
        return etat && ["1-prev", "4-facture","2-budgete"].indexOf(etat.trim()) >= 0;
       };
	 var isNextPrev = function(etat) {
        return etat && ["1-prev", "2-budgete","3-estime"].indexOf(etat.trim()) >= 0;
       };   

       $("#selectbox").dxSelectBox({
        dataSource: years,
        value: years[7].cle,
        valueExpr: "cle",
        displayExpr: "valeur",
        onValueChanged: function(data) {
            dataGrid.clearFilter();
            dataGrid.filter(["annee", "=", data.value]);
        }
    });
    var dataGrid = $("#gridContainerGestion").dxDataGrid({
        dataSource: storeGestion,
       // repaintChangesOnly: true,
        showBorders: true,
        columnMaxWidth: 200,
        allowColumnResizing: true,
        columnHidingEnabled: true,
        focusedRowEnabled: true,
        allowColumnReordering: true,
		filterValue: ["annee", "=", $("#selectbox").dxSelectBox('instance').option('value')],
        selection: {
            mode: "multiple"
        },
        "export": {
           enabled: true,
           fileName: "Bdds_gestion"
         },
         filterPanel: { visible: true },
         //filterValue: [["annee", "=", 2020]],
         columnChooser: {
         enabled: true,
         mode:"select"
        },
		 paging: {
            pageSize: 100
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50,100,150],
            showInfo: true
        },
        sorting: {
            mode: "multiple"
        },
        headerFilter: {
            visible: true
        },
        filterRow: {
            visible: true,
            applyFilter: "auto"
        },
        searchPanel: {
            visible: true
        },
        groupPanel: { visible: false },
        grouping: {
            autoExpandAll: false
        },
		onEditorPreparing: function (e) {
            if (e.parentType != "dataRow") return;  
              rowIndex = e.row.rowIndex; 
              bdd_id = e.row.data.bdd_id 
              annee = e.row.data.annee

        },
       editing: {
        mode: "popup",
        popup: {
            title: "Calculs des montants",
            showTitle: true,
            width: 1100,
            height: 600,
            /*position: {
                my: "top",
                at: "top",
                of: window
            },*/
			 toolbarItems: [
                    {
                        toolbar:'bottom',  
                        location: 'before',  
                        widget: "dxButton",
                        options: {
                            text: "Calculer",  
                            onClick: function(e){
                            //Aditional step here
                            is_tva_mixte = $("#tva_mixte").dxCheckBox('instance').option('value')
                            calculate_jquery(rowIndex,bdd_id,annee,is_tva_mixte)
                            }
                        }
                    },
                    {
                        toolbar:'bottom',  
                        location: 'after',  
                        widget: "dxButton",
                        options: {
                            text: "Save",  
                            onClick: function(e){
                                saveFormData()
                              }
                        }
                    },
                    {
                        toolbar: 'bottom',
                        location: 'after',
                        widget: 'dxButton',
                        options: {
                            onClick: function(e) {
                                cancelFormData()
                            },
                            text: 'Cancel'
                        }
                    }
                ]
        },
        form: {
            items: [
                {
                    itemType: "group",
                    items: ["bdd_id","annee","etat","compte_recherche"]
                },
                {
                    itemType: "group",
                    colCount: 2,
                    items: ["montant_initial", "devise","taux_change","montant_ht",
					{  
                            name: 'tva_mixte',  
                            label: { text: 'Taux de TVA multiple sur la ressource' }, 
                            helpText: 'Si coché, remplir manuellement les montants à associer aux taux de TVA 1 et 2 (les calculs commencent à ce niveau)',
                            template: function(data, itemElement) {  
                                itemElement.append($("<div id='tva_mixte'>").dxCheckBox({
                                    value: false,
                                    /*onValueChanged: function(data) {
                                        console.log(data.value)
                                    }, */
                                })
                                );  
                            }  
                        }, 
						]
                },{
                itemType: "group",
                caption: "TVA",
                colCount: 2,
                colSpan: 2,
                items: ["taux_tva1", "part_tva1", "taux_tva2","part_tva2"]
            }, {
                itemType: "group",
                caption: "Frais de gestion",
                colCount: 2,
                colSpan: 2,
                items: ["montant_frais_gestion","taux_tva_frais_gestion"]
            },
            {
                itemType: "group",
                caption: "Récup TVA",
                items: ["taux_recup_tva"]
            },
            {
                itemType: "group",
                caption: "Montants intermédiaires (pour vérification)",
                items: ["montant_ttc_avant_recup","montant_tva_avant_recup","montant_tva_apres_recup"]
            },
            {
                itemType: "group",
                caption: "Total",
                items: ["montant_ttc","reliquat","last_estime"]
            },
            {
                itemType: "group",
                caption: "Notes",
                items: [{
                    dataField: "commentaire",
                    editorType: "dxTextArea",
                    editorOptions: {
                        height: 100
                    }
                }]
            },
            {
                itemType: "group",
                caption: "Périmètre",
                colCount: 2,
                colSpan: 2,
                items: ["perimetre","surcout_uca","refacturation"]
            },
        ]
        },
        allowUpdating: editMode,
        allowDeleting: editMode,
        allowAdding: editMode,
        useIcons: true
         },
        columns: [
            {
                type: "buttons",
                caption: "Editer",
                width: 100,
                buttons: ["edit","delete"],
                useIcons: true
                },
                {
                    dataField: "pole",
                    caption: "Pole",
                    groupIndex: 1,
                    editorOptions: {
                        disabled: true
                    }
                },
              {
                dataField: "etat",
                caption: "Etat",
                validationRules: [{
                    type: "required",
                    message: "Champ obligatoire"
                }],
                lookup: {
                 dataSource: etatState,
                 displayExpr: "valeur",
                 valueExpr: "cle"
                },
                sortOrder: "asc",
				width: 100
            },
              {
                type: "buttons",
                caption: "Actions",
                width: 250,
                buttons: [{
                    hint: "Etape suivante : créer Budgété",
                    //icon: "./img/button_budgete.png",
                    text: "Créer Budgété",
                    visible: function(e) {
                        return !e.row.isEditing && !isNextBudgete(e.row.data.etat);
                    },
                    onClick: function(e) {
                        var clonedItem =  $.extend({}, e.row.data, {etat: "2-budgete"},{id:""});
                        var filtered = _.pick(clonedItem, function (v) { return v !== '' && v !== null; });
                        console.log(filtered)
                        createItems(urlGestion,filtered)
                        e.component.refresh(true);
                    }
                },
                {
                    hint: "Etape suivante : créer Estimé",
                    //icon: "./img/button_estime.png",
                    text: "Créer Estimé",
                    visible: function(e) {
                        return !e.row.isEditing && !isNextEstime(e.row.data.etat);
                    },
                    onClick: function(e) {
                        var clonedItem =  $.extend({}, e.row.data, {etat: "3-estime"},{id:""});
                        var filtered = _.pick(clonedItem, function (v) { return v !== '' && v !== null; });
                        console.log(filtered)
                        createItems(urlGestion,filtered)
                        e.component.refresh(true);
                    }
                },
                {
                    hint: "Etape suivante : créer Facturé",
                    //icon: "./img/button_facture.png",
                    text: "Créer Facturé",
                    visible: function(e) {
                        return !e.row.isEditing && !isNextFacture(e.row.data.etat);
                    },
                    onClick: function(e) {
                        var clonedItem =  $.extend({}, e.row.data, {etat: "4-facture"},{id:""});
                        var filtered = _.pick(clonedItem, function (v) { return v !== '' && v !== null; });
                        console.log(filtered)
                        createItems(urlGestion,filtered)
                        e.component.refresh(true);
                    }
                },
                {
                    hint: "Etape suivante : créer Facturé",
                    //icon: "./img/button_facture.png",
                    text: "Créer Facturé",
                    visible: function(e) {
                        return !e.row.isEditing && !isNextEstime2Facture(e.row.data.etat);
                    },
                    onClick: function(e) {
                        var clonedItem =  $.extend({}, e.row.data, {etat: "4-facture"},{last_estime:e.row.data.montant_ttc},{id:""});
                        var filtered = _.pick(clonedItem, function (v) { return v !== '' && v !== null; });
                        console.log(filtered)
                        createItems(urlGestion,filtered)
                        deleteItems(urlGestion,e.row.data.id)
                        e.component.refresh(true);
                    }
                },
				  {
                    hint: "Etape suivante : créer Prévisionnel N+1",
                    //icon: "/img/button_estime.png",
                    text: "Créer Prévisionnel +"+$("#prevRate").val()+"%",
                    visible: function(e) {
                        return !e.row.isEditing && !isNextPrev(e.row.data.etat);
                    },
                    onClick: function(e) {
                        var rate = $("#prevRate").val()
                        var clonedItem =  $.extend({}, e.row.data, {etat: "1-prev"},{id:""},
                                                                   {"annee": parseInt(e.row.data.annee) + 1},
                                                                   {"montant_initial": e.row.data.montant_initial + (e.row.data.montant_initial*rate/100)},
                                                                   {"montant_ht": e.row.data.montant_ht + (e.row.data.montant_ht*rate/100)},
                                                                   {"part_tva1": e.row.data.part_tva1 + (e.row.data.part_tva1*rate/100)},
                                                                   {"part_tva2": e.row.data.part_tva2 + (e.row.data.part_tva2*rate/100)},
                                                                   {"montant_ttc": e.row.data.montant_ttc + (e.row.data.montant_ttc*rate/100)},
                                                                   {"reliquat": 0});
                        var filtered = _.pick(clonedItem, function (v) { return v !== '' && v !== null; });
                        console.log(filtered)
                        createItems(urlGestion,filtered)
                        e.component.refresh(true);
                    }
                },
               ]
            },
            {
                dataField: "bdd_id",
                caption: "Ressource",
                groupIndex: 2,
                lookup:
                {
                    dataSource: storeBdds,
                    valueExpr: "id",
                    displayExpr: "bdd"
                }
            },	
            {
                dataField: "annee",
                caption: "Année",
				editorOptions: {  
                    step: 0  
                },
                visible: false
            },	
            {
                dataField: "compte_recherche",
                caption: "Compte Recherche",
                visible: false,
                lookup: {
                    dataSource: binaryState,
                    displayExpr: "valeur",
                    valueExpr: "cle"
                 }
            },	
            {
                dataField: "devise",
                caption: "Devise",
                visible:false,
                lookup: {
                 dataSource: deviseState,
                 displayExpr: "valeur",
                 valueExpr: "cle"
              }
            },
            {
                dataField: "montant_initial",
                caption: "Montant initial",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
            },
            {
                dataField: "taux_change",
                caption: "Taux de change",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
            },
            {
                dataField: "montant_ht",
                caption: "Montant HT",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                width: 150,
            },
            {
                dataField: "part_tva1",
                caption: "Montant HT au taux TVA 1",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
            },
            {
                dataField: "taux_tva1",
                caption: "Taux de TVA 1",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
            },
            {
                dataField: "part_tva2",
                caption: "Montant HT au taux TVA 2",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
            },
            {
                dataField: "taux_tva2",
                caption: "Taux de TVA 2",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
            },
            {
                dataField: "montant_frais_gestion",
                caption: "Frais de gestion (montant)",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
            },
            {
                dataField: "taux_tva_frais_gestion",
                caption: "Taux de TVA sur les frais de gestion",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
            },
            {
                dataField: "taux_recup_tva",
                caption: "Taux de Récup TVA",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
            },
            {
                dataField: "montant_ttc_avant_recup",
                caption: "Info : Montant TTC avant récup",
                dataType: 'number',
                visible: true,
                width: 200
            },
            {
                dataField: "montant_tva_avant_recup",
                caption: "Info : Montant TVA avant récup",
                dataType: 'number',
                visible: false,
            },
            {
                dataField: "montant_tva_apres_recup",
                caption: "Info : Montant TVA après récup",
                dataType: 'number',
                visible: false,
            },
            {
                dataField: "montant_ttc",
                caption: "Montant TTC avec récup",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                width: 200,
            },
            {
                dataField: "reliquat",
                caption: "Reliquat",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
				width: 200
            },
            {
                dataField: "last_estime",
                caption: "Estimé : dernière valeur",
                visible: false,
                editorOptions: {
                    disabled: true
                }
            },
            {
                dataField: "commentaire",
                caption: "Commentaire",
                visible: false
            },
            {
                dataField: "perimetre",
                caption: "Périmètre abonnement",
                visible: false,
                editorOptions: {
                    disabled: true
                }
            },		
            {
                dataField: "surcout_uca",
                caption: "Surcoût UCA-EC",
				editorOptions: {  
                    step: 0  
                },
                visible: false
            },	
            {
                dataField: "refacturation",
                caption: "Refacturation (montant)",
				editorOptions: {  
                    step: 0  
                },
                visible: false
            },	
            {
               dataField: "createdAt",
               caption: "Crée le",
               visible: false,
             },
           {
              dataField: "updatedAt",
              caption: "Modifié le"
          }
],
selectedRowKeys: [],
        onSelectionChanged: function(e) {
            e.component.refresh(true);
        },
summary: {
    recalculateWhileEditing: true,
   /* groupItems: [{
        column: "bdd_id",
        column: "montant_ttc",
        summaryType: "sum",
        displayFormat: "{0} Ressources",
                }],*/
     totalItems: [{
          name: "SelectedRowsSummary",
          showInColumn: "montant_ht",
           displayFormat: "Simulation compte recherche: {0}",
           summaryType: "custom"
        }
            ],
            calculateCustomSummary: function (options) {
                if (options.name === "SelectedRowsSummary") {
                    if (options.summaryProcess === "start") {
                        options.totalValue = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        if (options.component.isRowSelected(options.value.id)) {
                            options.totalValue = options.totalValue + options.value.montant_ht;
                        }
                    }
                }
            }            
},
onCellPrepared: function(e) {
    if(e.rowType === "data") {	
            if(e.data.etat === "2-budgete"){
            e.cellElement.css({ "background-color": "#C9ECD7", "font-weight": "bold" });
            }
        }
    },
	onEditingStart: function(e) {
        //console.log(e.data)
       // var dataGrid = e.component
        //dataGrid.cellValue(e.key, "montant_ht", 500)
        
    } 
    }).dxDataGrid("instance");

//create prev N+1
 $("#submitPrev").click(function(){
    //createNewPrev($("#prevRate").val(),$("#refYear").val(),$("input[name='prevBaseField']:checked").val())
	createNewPrev($("#prevRate").val(), $("#refYear").val())
})

  function generateNewPrevData(data,year,rate){      
            var obj = {
                "bdd_id": data.bdd_id,
                "etat": "1-prev",
                "annee": parseInt(year) + 1,
                "compte_recherche": 0,
                "montant_initial": data.montant_initial + (data.montant_initial * rate / 100),
                "devise": data.devise,
                "taux_change": data.taux_change,
                "montant_ht": data.montant_ht + (data.montant_ht * rate / 100),
                "part_tva1": data.part_tva1 + (data.part_tva1 * rate / 100),
                "taux_tva1": data.taux_tva1,
                "part_tva2": data.part_tva2 + (data.part_tva2 * rate / 100),
                "taux_tva2": data.taux_tva2,
                "taux_recup_tva": data.taux_recup_tva,
                "taux_tva_frais_gestion": data.taux_tva_frais_gestion,
                "montant_frais_gestion": data.montant_frais_gestion,
                "montant_ttc": data.montant_ttc + (data.montant_ttc * rate / 100)
            }   
            return createItems(urlGestion, obj)
    }
	
    function createNewPrev(rate, year) {
        //getItems(urlGestion + "?annee=" + $("#selectbox").dxSelectBox('instance').option('value') + "&etat=4-facture")
        getItems(urlGestion + "?annee=" + $("#selectbox").dxSelectBox('instance').option('value'))
            .done(function (results) {
              var arr = groupBy(results,"bdd_id","montant_ttc")
               arr.map(function(d){
                   //on vérifie qu'il n'y ait pas déjà de prévisionnel rentré en N+1 (auquel cas on ne fait rien)
                   getItems(urlGestion + "?annee=" + ($("#selectbox").dxSelectBox('instance').option('value')+1) + "&bdd_id="+d.bdd_id+"&etat=1-prev").done(function(result) {
                       if (result.length ==0) {
                       //s'il y a un facturé en N on le prend
                   if(d["4-facture"]) {
                   results
                    .filter(function(d1){return (d1.bdd_id == d.bdd_id) & (d1.etat == "4-facture")})
                    .map(function(d2){
                       return generateNewPrevData(d2,year,rate)
                    })
                   }
                   //s'il n'y a pas de facturé on prend l'estimé
                   else {
                       results
                       .filter(function(d1){return (d1.bdd_id == d.bdd_id) & (d1.etat == "3-estime")})
                       .map(function(d2){
                        return generateNewPrevData(d2,year,rate)
                     })
                   }
                }
                })
                })
            })
    }
function cancelFormData() {
    $("#gridContainerGestion").dxDataGrid("cancelEditData"); 
}

function saveFormData() {
$("#gridContainerGestion").dxDataGrid("saveEditData")
}

function calculate_jquery(rowindex,bdd_id,annee,is_tva_mixte){
    console.log(is_tva_mixte)
    var e = jQuery.Event("keydown");
    e.which = 13;
    var cell_montant_ht = parseFloat($( "input[id$='taux_change']" ).val()) * parseFloat($( "input[id$='montant_initial']" ).val())
    $( "input[id$='montant_ht']" ).focus().val(cell_montant_ht).trigger(e);
    if (!is_tva_mixte) {
    $( "input[id$='part_tva1']" ).val(cell_montant_ht).trigger(e)
    }
    var montant_tva = (parseFloat($( "input[id$='part_tva1']" ).val()) * (parseFloat($( "input[id$='taux_tva1']" ).val()) / 100)) + (parseFloat($( "input[id$='part_tva2']" ).val()) * (parseFloat($( "input[id$='taux_tva2']" ).val()) / 100))
    //var montant_tva = parseFloat($( "input[id$='part_tva1']" ).val()) * (parseFloat($( "input[id$='taux_tva1']" ).val()) / 100)
    var ttc_horsrecup_horsgestion = cell_montant_ht + montant_tva
    var montant_tva_frais_gestion = parseFloat($( "input[id$='montant_frais_gestion']" ).val()) * parseFloat($( "input[id$='taux_tva_frais_gestion']" ).val()) /100
    var total_frais_gestion = parseFloat($( "input[id$='montant_frais_gestion']" ).val()) + montant_tva_frais_gestion
    console.log(total_frais_gestion)
    var ttc_avant_recup = ttc_horsrecup_horsgestion + total_frais_gestion
    $( "input[id$='montant_ttc_avant_recup']" ).val(ttc_avant_recup).trigger(e)
    var total_montant_tva = montant_tva + montant_tva_frais_gestion
    $( "input[id$='montant_tva_avant_recup']" ).val(total_montant_tva).trigger(e)
    var montant_recup = total_montant_tva * parseFloat($( "input[id$='taux_recup_tva']" ).val()) / 100
    var montant_tva_apres_recup = total_montant_tva - montant_recup
    $( "input[id$='montant_tva_apres_recup']" ).val(montant_tva_apres_recup).trigger(e)
    var montant_ttc = ttc_horsrecup_horsgestion + total_frais_gestion - montant_recup
    $( "input[id$='montant_ttc']" ).val(montant_ttc).trigger(e)   
    //maj reliquat
    var etat = $( "input[id$='etat']" ).val()
    if (etat == "Facturé" || etat == "Estimé") {
        return getItems(urlGestion + '/?bdd_id=' + bdd_id + '&annee=' + annee + '&etat=2-budgete').done(function (result) {
            var reliquat = result[0].montant_ttc - montant_ttc
            $( "input[id$='reliquat']" ).val(reliquat).trigger(e)
        });
    }
}
})