$(function(){

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
        value: 2021,
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
                    items: ["montant_initial", "devise","taux_change","montant_ht"]
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
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
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
                sortOrder: "asc"
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
                setCellValue: function(newData, value, currentRowData) {
                    newData.montant_initial = value;
                    newData.montant_ht = currentRowData.taux_change * value;
                    newData.part_tva1 = currentRowData.taux_change * value;
                }
            },
            {
                dataField: "taux_change",
                caption: "Taux de change",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
                setCellValue: function(newData, value, currentRowData) {
                    newData.taux_change = value;
                    newData.montant_ht = currentRowData.montant_initial * value;
                    newData.part_tva1 = currentRowData.montant_initial * value;
                }
            },
            {
                dataField: "montant_ht",
                caption: "Montant HT",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                width: 150,
                setCellValue: function(newData, value) {
                    this.defaultSetCellValue(newData, value);
                }
            },
            {
                dataField: "part_tva1",
                caption: "Montant HT au taux TVA 1",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
                 setCellValue: function(newData, value, currentRowData) {
                    newData.part_tva1 = value;
                    //calcul montant tva "de base"
                    var montant_tva = (currentRowData.taux_tva1/100 * value)+(currentRowData.taux_tva2/100 * currentRowData.part_tva2)
                   //calcul ttc intermédiaire
                    var ttc_horsrecup_horsgestion = (value + (currentRowData.taux_tva1/100 * value)) + 
                                         (currentRowData.part_tva2+(currentRowData.taux_tva2/100 * currentRowData.part_tva2));
                    var total_frais_gestion = currentRowData.montant_frais_gestion + (currentRowData.montant_frais_gestion * currentRowData.taux_tva_frais_gestion/100) 
                    //imputation ttc avec all tva mais avant récup
                    newData.montant_ttc_avant_recup = ttc_horsrecup_horsgestion + total_frais_gestion
                    //calcul et imputation montants tva avant récup
                    var total_montant_tva = montant_tva + (currentRowData.montant_frais_gestion * currentRowData.taux_tva_frais_gestion/100)  
                    newData.montant_tva_avant_recup = total_montant_tva 
                    //calcul et imputation montants tva apres récup                
                    var montant_recup = total_montant_tva*currentRowData.taux_recup_tva/100  
                    newData.montant_tva_apres_recup = total_montant_tva - montant_recup
                    //ttc final
                    newData.montant_ttc = ttc_horsrecup_horsgestion + total_frais_gestion - montant_recup 
                    if(currentRowData.etat == "4-facture"  || currentRowData.etat == "3-estime"){  
                        return getItems(urlGestion+'/?bdd_id='+currentRowData.bdd_id+'&annee='+currentRowData.annee+'&etat=2-budgete').done(function(result) {
                            newData.reliquat = result[0].montant_ttc - newData.montant_ttc
                          });
                        }
                    }
            },
            {
                dataField: "taux_tva1",
                caption: "Taux de TVA 1",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
                setCellValue: function(newData, value, currentRowData) {
                    newData.taux_tva1 = value;
                     //calcul montant tva "de base"
                    var montant_tva = (value/100 * currentRowData.part_tva1)+(currentRowData.taux_tva2/100 * currentRowData.part_tva2)
                    //calcul ttc intermédiaire
                    var ttc_horsrecup_horsgestion = (currentRowData.part_tva1 + (value/100 * currentRowData.part_tva1)) + 
                                         (currentRowData.part_tva2+(currentRowData.taux_tva2/100 * currentRowData.part_tva2));
                    var total_frais_gestion = currentRowData.montant_frais_gestion + (currentRowData.montant_frais_gestion * currentRowData.taux_tva_frais_gestion/100)                     
                    //imputation ttc avec all tva mais avant récup
                    newData.montant_ttc_avant_recup = ttc_horsrecup_horsgestion + total_frais_gestion
                     //calcul et imputation montants tva avant récup
                    var total_montant_tva = montant_tva + (currentRowData.montant_frais_gestion * currentRowData.taux_tva_frais_gestion/100)  
                    newData.montant_tva_avant_recup = total_montant_tva 
                    //calcul et imputation montants tva apres récup 
                    var montant_recup = total_montant_tva*currentRowData.taux_recup_tva/100  
                    newData.montant_tva_apres_recup = total_montant_tva - montant_recup
                    //ttc final                   
                    newData.montant_ttc = ttc_horsrecup_horsgestion + total_frais_gestion - montant_recup 
                    if(currentRowData.etat == "4-facture"  || currentRowData.etat == "3-estime"){  
                        return getItems(urlGestion+'/?bdd_id='+currentRowData.bdd_id+'&annee='+currentRowData.annee+'&etat=2-budgete').done(function(result) {
                            newData.reliquat = result[0].montant_ttc - newData.montant_ttc
                          });
                        }
                }
            },
            {
                dataField: "part_tva2",
                caption: "Montant HT au taux TVA 2",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
                setCellValue: function(newData, value, currentRowData) {
                    newData.part_tva2 = value;
                     //calcul montant tva "de base"
                    var montant_tva = (currentRowData.taux_tva2/100 * value)+(currentRowData.taux_tva1/100 * currentRowData.part_tva1)
                   //calcul ttc intermédiaire
                    var ttc_horsrecup_horsgestion = (value + (currentRowData.taux_tva2/100 * value)) + 
                                         (currentRowData.part_tva1+(currentRowData.taux_tva1/100 * currentRowData.part_tva1));
                    var total_frais_gestion = currentRowData.montant_frais_gestion + (currentRowData.montant_frais_gestion * currentRowData.taux_tva_frais_gestion/100)                     
                    //imputation ttc avec all tva mais avant récup
                    newData.montant_ttc_avant_recup = ttc_horsrecup_horsgestion + total_frais_gestion
                   //calcul et imputation montants tva avant récup
                   var total_montant_tva = montant_tva + (currentRowData.montant_frais_gestion * currentRowData.taux_tva_frais_gestion/100)  
                   newData.montant_tva_avant_recup = total_montant_tva 
                   //calcul et imputation montants tva apres récup 
                   var montant_recup = total_montant_tva*currentRowData.taux_recup_tva/100  
                   newData.montant_tva_apres_recup = total_montant_tva - montant_recup
                   //ttc final                   
                   newData.montant_ttc = ttc_horsrecup_horsgestion + total_frais_gestion - montant_recup 
                    if(currentRowData.etat == "4-facture"  || currentRowData.etat == "3-estime"){  
                        return getItems(urlGestion+'/?bdd_id='+currentRowData.bdd_id+'&annee='+currentRowData.annee+'&etat=2-budgete').done(function(result) {
                            newData.reliquat = result[0].montant_ttc - newData.montant_ttc
                          });
                        }
                }
            },
            {
                dataField: "taux_tva2",
                caption: "Taux de TVA 2",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
                setCellValue: function(newData, value, currentRowData) {
                    newData.taux_tva2 = value;
                     //calcul montant tva "de base"
                    var montant_tva = (value/100 * currentRowData.part_tva2)+(currentRowData.taux_tva1/100 * currentRowData.part_tva1)
                     //calcul ttc intermédiaire
                    var ttc_horsrecup_horsgestion = (currentRowData.part_tva2 + (value/100 * currentRowData.part_tva2)) + 
                                         (currentRowData.part_tva1+(currentRowData.taux_tva1/100 * currentRowData.part_tva1));
                    var total_frais_gestion = currentRowData.montant_frais_gestion + (currentRowData.montant_frais_gestion * currentRowData.taux_tva_frais_gestion/100)                     
                   //imputation ttc avec all tva mais avant récup
                   newData.montant_ttc_avant_recup = ttc_horsrecup_horsgestion + total_frais_gestion
                   //calcul et imputation montants tva avant récup
                   var total_montant_tva = montant_tva + (currentRowData.montant_frais_gestion * currentRowData.taux_tva_frais_gestion/100)  
                   newData.montant_tva_avant_recup = total_montant_tva 
                   //calcul et imputation montants tva apres récup 
                   var montant_recup = total_montant_tva*currentRowData.taux_recup_tva/100  
                   newData.montant_tva_apres_recup = total_montant_tva - montant_recup
                   //ttc final                   
                   newData.montant_ttc = ttc_horsrecup_horsgestion + total_frais_gestion - montant_recup 
                    if(currentRowData.etat == "4-facture"  || currentRowData.etat == "3-estime"){  
                        return getItems(urlGestion+'/?bdd_id='+currentRowData.bdd_id+'&annee='+currentRowData.annee+'&etat=2-budgete').done(function(result) {
                            newData.reliquat = result[0].montant_ttc - newData.montant_ttc
                          });
                        }
                }
            },
            {
                dataField: "montant_frais_gestion",
                caption: "Frais de gestion (montant)",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
                setCellValue: function(newData, value, currentRowData) {
                    newData.montant_frais_gestion = value;
                    //calcul montant tva "de base"
                    var montant_tva = (currentRowData.taux_tva2/100 * currentRowData.part_tva2)+(currentRowData.taux_tva1/100 * currentRowData.part_tva1)
                    //calcul ttc intermédiaire
                    var ttc_horsrecup_horsgestion = (currentRowData.part_tva2 + (currentRowData.taux_tva2/100 * currentRowData.part_tva2)) + 
                                         (currentRowData.part_tva1+(currentRowData.taux_tva1/100 * currentRowData.part_tva1));
                    var total_frais_gestion = value + (value * currentRowData.taux_tva_frais_gestion/100)                                         
                   //imputation ttc avec all tva mais avant récup
                   newData.montant_ttc_avant_recup = ttc_horsrecup_horsgestion + total_frais_gestion
                   //calcul et imputation montants tva avant récup
                   var total_montant_tva = montant_tva + (value * currentRowData.taux_tva_frais_gestion/100)  
                   newData.montant_tva_avant_recup = total_montant_tva 
                   //calcul et imputation montants tva apres récup 
                   var montant_recup = total_montant_tva*currentRowData.taux_recup_tva/100  
                   newData.montant_tva_apres_recup = total_montant_tva - montant_recup
                   //ttc final                   
                   newData.montant_ttc = ttc_horsrecup_horsgestion + total_frais_gestion - montant_recup 
                    if(currentRowData.etat == "4-facture"  || currentRowData.etat == "3-estime"){  
                        return getItems(urlGestion+'/?bdd_id='+currentRowData.bdd_id+'&annee='+currentRowData.annee+'&etat=2-budgete').done(function(result) {
                            newData.reliquat = result[0].montant_ttc - newData.montant_ttc
                          });
                        }
                }
            },
            {
                dataField: "taux_tva_frais_gestion",
                caption: "Taux de TVA sur les frais de gestion",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
                setCellValue: function(newData, value, currentRowData) {
                    newData.taux_tva_frais_gestion = value;
                     //calcul montant tva "de base"
                    var montant_tva = (currentRowData.taux_tva2/100 * currentRowData.part_tva2)+(currentRowData.taux_tva1/100 * currentRowData.part_tva1)
                     //calcul ttc intermédiaire
                    var ttc_horsrecup_horsgestion = (currentRowData.part_tva2 + (currentRowData.taux_tva2/100 * currentRowData.part_tva2)) + 
                                         (currentRowData.part_tva1+(currentRowData.taux_tva1/100 * currentRowData.part_tva1));
                    var total_frais_gestion = currentRowData.montant_frais_gestion + (currentRowData.montant_frais_gestion * value/100)                                        
                    //imputation ttc avec all tva mais avant récup
                    newData.montant_ttc_avant_recup = ttc_horsrecup_horsgestion + total_frais_gestion
                    //calcul et imputation montants tva avant récup
                    var total_montant_tva = montant_tva + (currentRowData.montant_frais_gestion * value/100)  
                    newData.montant_tva_avant_recup = total_montant_tva 
                    //calcul et imputation montants tva apres récup 
                    var montant_recup = total_montant_tva*currentRowData.taux_recup_tva/100  
                    newData.montant_tva_apres_recup = total_montant_tva - montant_recup
                    //ttc final                   
                    newData.montant_ttc = ttc_horsrecup_horsgestion + total_frais_gestion - montant_recup 
                    if(currentRowData.etat == "4-facture"  || currentRowData.etat == "3-estime"){  
                        return getItems(urlGestion+'/?bdd_id='+currentRowData.bdd_id+'&annee='+currentRowData.annee+'&etat=2-budgete').done(function(result) {
                            newData.reliquat = result[0].montant_ttc - newData.montant_ttc
                          });
                        }
                }
            },
            {
                dataField: "taux_recup_tva",
                caption: "Taux de Récup TVA",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                visible: false,
                setCellValue: function(newData, value, currentRowData) {
                    newData.taux_recup_tva = value;
                     //calcul montant tva "de base"
                    var montant_tva = (currentRowData.taux_tva2/100 * currentRowData.part_tva2)+(currentRowData.taux_tva1/100 * currentRowData.part_tva1)
                    //calcul ttc intermédiaire
                    var ttc_horsrecup_horsgestion = (currentRowData.part_tva2 + (currentRowData.taux_tva2/100 * currentRowData.part_tva2)) + 
                                         (currentRowData.part_tva1+(currentRowData.taux_tva1/100 * currentRowData.part_tva1));
                    var total_frais_gestion = currentRowData.montant_frais_gestion + (currentRowData.montant_frais_gestion * currentRowData.taux_tva_frais_gestion/100)                                         
                     //imputation ttc avec all tva mais avant récup
                     newData.montant_ttc_avant_recup = ttc_horsrecup_horsgestion + total_frais_gestion
                     //calcul et imputation montants tva avant récup
                     var total_montant_tva = montant_tva + (currentRowData.montant_frais_gestion * value/100)  
                     newData.montant_tva_avant_recup = total_montant_tva 
                     //calcul et imputation montants tva apres récup 
                     var montant_recup = total_montant_tva*value/100  
                     newData.montant_tva_apres_recup = total_montant_tva - montant_recup
                     //ttc final                   
                     newData.montant_ttc = ttc_horsrecup_horsgestion + total_frais_gestion - montant_recup 
                    if(currentRowData.etat == "4-facture"  || currentRowData.etat == "3-estime"){  
                    return getItems(urlGestion+'/?bdd_id='+currentRowData.bdd_id+'&annee='+currentRowData.annee+'&etat=2-budgete').done(function(result) {
                        newData.reliquat = result[0].montant_ttc - newData.montant_ttc
                      });
                    }
                }
            },
            {
                dataField: "montant_ttc_avant_recup",
                caption: "Info : Montant TTC avant récup",
                dataType: 'number',
                visible: false,
                editorOptions: {
                    disabled: true
                },
                setCellValue: function(currentRowData,newData, value) {      
                    this.defaultSetCellValue(newData, value);                 
                }
            },
            {
                dataField: "montant_tva_avant_recup",
                caption: "Info : Montant TVA avant récup",
                dataType: 'number',
                visible: false,
                editorOptions: {
                    disabled: true
                },
                setCellValue: function(currentRowData,newData, value) {      
                    this.defaultSetCellValue(newData, value);                 
                }
            },
            {
                dataField: "montant_tva_apres_recup",
                caption: "Info : Montant TVA après récup",
                dataType: 'number',
                visible: false,
                editorOptions: {
                    disabled: true
                },
                setCellValue: function(currentRowData,newData, value) {      
                    this.defaultSetCellValue(newData, value);                 
                }
            },
            {
                dataField: "montant_ttc",
                caption: "Montant TTC avec récup",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                width: 150,
                setCellValue: function(currentRowData,newData, value) {      
                    this.defaultSetCellValue(newData, value);                 
                }
            },
            {
                dataField: "reliquat",
                caption: "Reliquat",
                dataType: 'number',
				editorOptions: {  
                    step: 0  
                },
                setCellValue: function(newData, value) {
                    this.defaultSetCellValue(newData, value);
                }
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
    createNewPrev($("#prevRate").val(),$("#refYear").val(),$("input[name='prevBaseField']:checked").val())
})
function createNewPrev(rate,year){
    //console.log(rate + ":" + field + ":" + $("#selectbox").dxSelectBox('instance').option('value'))
     getItems(urlGestion+"?annee="+$("#selectbox").dxSelectBox('instance').option('value')+"&etat=4-facture")
        .done(function(results) {
            results.map(function(d) {
                var obj = {
                    "bdd_id":d.bdd_id,
                    "etat": "1-prev",
                    "annee": parseInt(year) + 1,
                    "compte_recherche": 0,
                    "montant_initial" : d.montant_initial + (d.montant_initial*rate/100),
                    "devise": d.devise,
                    "taux_change": d.taux_change,
                    "montant_ht": d.montant_ht + (d.montant_ht*rate/100),
                    "part_tva1": d.part_tva1 + (d.part_tva1*rate/100),
                    "taux_tva1": d.taux_tva1,
                    "part_tva2": d.part_tva2 + (d.part_tva2*rate/100),
                    "taux_tva2": d.taux_tva2,
                    "taux_recup_tva": d.taux_recup_tva,
                    "taux_tva_frais_gestion": d.taux_tva_frais_gestion,
                    "montant_frais_gestion": d.montant_frais_gestion,
                    "montant_ttc": d.montant_ttc + (d.montant_ttc*rate/100),
                }               
                return createItems(urlGestion,obj)})
        })
}
})