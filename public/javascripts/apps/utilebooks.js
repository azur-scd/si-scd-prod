$(function () {
     /*---data middleware in php si-scd instance, see javascripts/externalPhpCurl.js---*/

  /*--Numilog--
  $("#submitNumilogIsbn").click(function () {
    $("#resultsNumilog").empty();
    var lines = $('textarea#areaNumilog').val().split('\n');
    for (let line of lines) {
      $.getJSON(parseNumilogHtml, { "isbn": line.trim() }).then(function (data) {
        console.log(data);
        if (data.title) {
          $("#resultsNumilog").append("<tr><td>" + data.isbn + "</td><td><strong>" + data.title + "</strong></td><td>" + data.dispo + "</td></tr>")
        }
        else {
          $("#resultsNumilog").append("<tr><td>" + data.isbn + "</td><td><span class='label label-danger'>Erreur</span></td><td><span class='label label-danger'>Erreur</span></td></tr>")
        }
      })
    }
  })
  //clear   
  $("#clearNumilog").click(function () {
    $('textarea#areaNumilog').val("");
    $("#resultsNumilog").empty();
  })*/
  
 /*--ISBN to Primo ebooks--*/
 $("#submitIsbn2ebooks").click(function () {
    $("#resultsIsbn2ebooks").empty();
    var lines = $('textarea#areaIsbn2ebooks').val().split('\n');
    for (let line of lines) {
        if (line !== "") {
        var isbn = line.trim()
        isbn = isbn.replace(/-/g, '')
        $.getJSON(getPrimoApiRecordFields, { "isbn": isbn }).then(function (data) {
            if (data[0].totalhits == "0") {
                $("#resultsIsbn2ebooks").append("<tr><td>" + data[0].isbn + "</td><td></td><td><span class='label label-danger'>" + data[0].totalhits + "</span></td><td></td><td></td><td></td></tr>")
            }
            else {
                var nbebooks = detect_ebooks(data[0]["nbebooks"])
               // let nbebooks = data[0]["nbebooks"].filter(d => d["@KEY"] == "online_resources")[0]["@VALUE"]
               let frbrgroupid; let totalhits_frbrgroupid; let nbebooks_frbrgroupid;
               if (Object.hasOwn(data[0], "frbrgroupid")) { 
                frbrgroupid = data[0]["frbrgroupid"]
                totalhits_frbrgroupid = data[0]["totalhits_frbrgroupid"]
                frbrgroupid_primo_url = "http://catalogue.unice.fr/primo-explore/search?query=any,contains,all_records&tab=new_tab&search_scope=UNS&vid=UNS&facet=frbrgroupid,include,"+frbrgroupid
                display_frbrgroupid_primo_url = "<a href='"+frbrgroupid_primo_url+"' target='_blanck'>lien Primo</a>"
                nbebooks_frbrgroupid = detect_ebooks(data[0]["nbebooks_frbrgroupid"])
               }
               else {
                frbrgroupid = ''
                totalhits_frbrgroupid = ''
                nbebooks_frbrgroupid = '' 
                display_frbrgroupid_primo_url = ''
               }
            
              
               $("#resultsIsbn2ebooks").append("<tr><td>" + data[0].isbn + "</td><td>" + data[0].title + "</td><td>" + data[0].totalhits + "</td><td>" + nbebooks + "</td><td>" + frbrgroupid + "</td><td>" + display_frbrgroupid_primo_url + "</td><td>" + totalhits_frbrgroupid + "</td><td>" + nbebooks_frbrgroupid + "</td></tr>")
            }
        })
}
    }
})
function detect_ebooks(item) {
    let nbebooks;
    // let nbebooks = data[0]["nbebooks"].filter(d => d["@KEY"] == "online_resources")[0]["@VALUE"]
    if (Array.isArray(item)) {
        if(item.filter(d => d["@KEY"] == "online_resources")) {
     nbebooks = item.filter(d => d["@KEY"] == "online_resources")[0]["@VALUE"]
        }
        else {
         nbebooks = "0"
     }
    }
    else {
      if (item["@KEY"] == "online_resources") {
         nbebooks = item["@VALUE"] 
      }
      else {
          nbebooks = "0"
      }
  }
  return nbebooks
}
//clear
$("#clearIsbn2ebooks").click(function () {
    $('textarea#areaIsbn2ebooks').val("");
    $("#resultsIsbn2ebooks").empty();
  })
})