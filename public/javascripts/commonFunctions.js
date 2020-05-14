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
    /*var barData = []
    Object.keys(agg).forEach(function(key){
    var value = agg[key];
    barData.push({labelField:key,'sum':value})});
    return barData;*/
    }

function getGroupCount(data,aggField) {
    var agg = _.countBy(data,aggField)
    console.log(object2array(agg))
	return object2array(agg)
}

function groupBy(data){
    var agg = _.groupBy(data,"bdd_id");
    var arr = []
    Object.keys(agg).forEach(function(key){
        var obj = {}
        getItems('/api/bdds/'+key).done(function(result) {
            obj["bdd_id"] = key;
            obj["bdd"] = result.bdd;
            obj["pole"] = result.pole_gestion;
          });
        var value = _.reduce(agg[key], function(memo,item) {
            memo[item.etat] = (memo[item.etat] || 0) + item.montant_ttc;
            return memo;
        }, {})
        arr.push(Object.assign(obj,value))  
    });
        return arr;
}