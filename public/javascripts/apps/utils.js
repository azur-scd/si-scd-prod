$(function(){
/*--Numilog--*/
$("#submitNumilogIsbn").click(function() {
    $("#resultsNumilog").empty();
    var lines = $('textarea#areaNumilog').val().split('\n');
    for(var i = 0;i < lines.length;i++){   
      $.getJSON(parseNumilogHtml, {"isbn":lines[i].trim()}).then(function(data){
      console.log(data);
      if(data.title) {
         $("#resultsNumilog").append("<tr><td>"+data.isbn+"</td><td><strong>"+data.title+"</strong></td><td>"+data.dispo+"</td></tr>")
        }
        else {
         $("#resultsNumilog").append("<tr><td>"+data.isbn+"</td><td><span class='label label-danger'>Erreur</span></td><td><span class='label label-danger'>Erreur</span></td></tr>")
       }
      })
    }
})
//clear   
$("#clearNumilog").click(function() {
   $('textarea#areaNumilog').val("");
   $("#resultsNumilog").empty();
})
    
    /*-- Isbn to Sudoc--*/
$("#submitIsbn2SudocIsbn").click(function() {
  $("#results0Isbn,#results1Isbn,#results2Isbn").empty();
  var count0Isbn = 0; var count1Isbn = 0; var count2Isbn = 0;
  var lines = $('textarea#areaIsbn2Sudoc').val().split('\n');
  for(var i = 0;i < lines.length;i++){
    var isbn = lines[i].trim()
    //$.getJSON("https://www.sudoc.fr/services/isbn2ppn/"+lines[i].trim()+"&format=text/json",{}).then(function(data){
    $.getJSON("https://www.sudoc.fr/services/isbn2ppn/"+isbn+"&format=text/json").done(function(data,isbn){
    console.log(isbn)   
    //if(data.sudoc.query.result){}
    if(data.sudoc.query.result.length){
        console.log(data.sudoc.query.result.length)
        $("#count2Isbn").empty();
        count2Isbn = count2Isbn + 1; 
        $("#count2Isbn").append(count2Isbn);
        var arr = []
        data.sudoc.query.result.map(function(d){return arr.push(d.ppn)})
        $("#results2Isbn").append("<tr><td>"+data.sudoc.query.isbn+"</td><td>"+arr.toString()+"</td></tr>")
      }
      else {
         $("#count1Isbn").empty();
        count1Isbn = count1Isbn + 1; 
        $("#count1Isbn").append(count1Isbn);
        $("#results1Isbn").append("<tr><td>"+data.sudoc.query.isbn+"</td><td>"+data.sudoc.query.result.ppn+"</td></tr>")
      }
    })
    .fail(function(jqXHR){
       console.log(JSON.parse(jqXHR.responseText).sudoc)
       $("#count0Isbn").empty();
       count0Isbn = count0Isbn + 1; 
       $("#count0Isbn").append(count0Isbn);
       $("#results0Isbn").append("<tr><td>"+JSON.parse(jqXHR.responseText).sudoc.error+"</td></tr>")
    })
  }
});
//clear
$("#clearIsbn2Sudoc").click(function() {
    $('textarea#areaIsbn2Sudoc').val("");
    $("#results0Isbn,#results1Isbn,#results2Isbn").empty();
})
})