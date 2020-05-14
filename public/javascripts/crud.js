function getItems(url){
    return $.ajax({
        method: 'GET',
        url: url,
        success: function (response) { return response.data;},
        error : function(response) {console.log(response.statusText);}
    })
}
 
 function updateItems(url,key, values){
     return  $.ajax({
        method: 'PUT',
        url: url +'/'+key+'/update',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: getDataEncoded(values),
        success: function (response) { return response.data;},
        error : function(response) {console.log(response.statusText);}
    })
 }
 
 function createItems(url,values){
    return  $.ajax({
        method: 'POST',
        url: url + '/create',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: getDataEncoded(values),
        success: function (response) { return response.data;},
        error : function(response) {console.log(response.statusText);}
   })
}	
 
 function deleteItems(url,key){
    return  $.ajax({
        method: 'DELETE',
        url: url +'/'+key+'/delete',
        success: function (response) { return response.data;},
        error : function(response) {console.log(response.statusText);}
   })
}

/*function getDataEncoded(jsonData){
    var formBody = [];
    for (var property in jsonData) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(jsonData[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  return formBody.join("&");
      }*/