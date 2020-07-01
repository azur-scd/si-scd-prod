function getDataEncoded(jsonData){
    var formBody = [];
    for (var property in jsonData) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(jsonData[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  return formBody.join("&");
}

function copyObjectProps(source, keys) {
    let newObject = {}
    keys.forEach(function(key) {	
        if(source[key] != null)				 
        newObject[key] = source[key]
    })
    return newObject
} 

function object2array (obj){
    //transfo d'un objet {key1:value1,key2:value2...} à un array [{key:key1,value:value1},{key:key1,value:value2}...]
    var arr = []
    Object.keys(obj).forEach(function(key){
     var value = obj[key];
     arr.push({"key":key,"value":value})});
     return arr;
}

function getGroupSum(data,labelField,aggField) {
    var agg = _.reduce(data, function(memo,item) {
        memo[item[labelField]] = (memo[item[labelField]] || 0) + item[aggField];
        return memo;
    }, {})
    return object2array(agg)
    }

function getGroupCount(data,aggField) {
    var agg = _.countBy(data,aggField)
   // console.log(object2array(agg))
	return object2array(agg)
}

function groupBy(data,groupKey){
    var agg = _.groupBy(data,groupKey);
   /* var agg = _(data).groupBy(function (o) { 
        return o.bdd_id;
      })*/
    var arr = []
    Object.keys(agg).forEach(function(key){
       /*Unused because of async data arrival after page has been loaded
        var obj = {};
        getItems(urlBdd+"/"+key).done(function(result) {
            obj["bdd_id"] = key;
            obj["bdd"] = result.bdd;
            obj["pole"] = result.pole_gestion;
            obj["soutien_oa"] = result.soutien_oa;
          });*/
        var value = _.reduce(agg[key], function(memo,item) {
            memo[item.etat] = (memo[item.etat] || 0) + item.montant_ttc;
            memo["reliquat"] = item.reliquat;
            memo["bdd_id"] = item.bdd_id;
            memo["bdd"] = item.bdd;
            memo["pole"] = item.pole;
            memo["soutien_oa"] = item.soutien_oa;
            memo["surcout_uca"] = item.surcout_uca;
            return memo;
        }, {})
         arr.push(value)
        //arr.push(Object.assign(obj,value))  
    });
        return arr;
}

function budgetSuiviSumAndCount(data){
    var budgeteInitial = data.reduce(
        (acc, v) => acc+ v["2-budgete"]
        , 0
    );

    var totalReliquat = data.reduce(
        (acc, v) => acc+ v["reliquat"]
        , 0
    );
  
    var budgeteOnly = data.filter(function(d){
      return d["2-budgete"] && !d["3-estime"] && !d["4-facture"]
    })
    var budgeteOnlyCount = budgeteOnly.length
    var budgeteOnlySum = budgeteOnly.reduce(
      (acc, v) => acc+ v["2-budgete"]
      , 0
  );
   var budgeteOnlyReliquat = budgeteOnly.reduce(
    (acc, v) => acc+ v["reliquat"]
    , 0
  );
  
  var estimeOnly = data.filter(function(d){
    return d["3-estime"] && !d["4-facture"]
  })
  var estimeOnlyCount = estimeOnly.length
  var estimeOnlySum = estimeOnly.reduce(
    (acc, v) => acc+ v["3-estime"]
    , 0
  );
  var estimeOnlyReliquat = estimeOnly.reduce(
    (acc, v) => acc+ v["reliquat"]
    , 0
  );
  var factureOnly = data.filter(function(d){
  return !d["3-estime"] && d["4-facture"]
  })
  var factureOnlyCount = factureOnly.length
  var factureOnlySum = factureOnly.reduce(
  (acc, v) => acc+ v["4-facture"]
  , 0
  );
  var factureOnlyReliquat = factureOnly.reduce(
    (acc, v) => acc+ v["reliquat"]
    , 0
  );
  return {budgeteInitial, totalReliquat,
          budgeteOnlySum,budgeteOnlyCount, budgeteOnlyReliquat,
          estimeOnlySum,estimeOnlyCount, estimeOnlyReliquat,
          factureOnlySum,factureOnlyCount, factureOnlyReliquat}
}