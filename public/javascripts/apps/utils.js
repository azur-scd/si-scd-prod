$(function () {
  /*--Numilog--*/
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
  })

  /*-- Isbn to Sudoc--*/
  $("#submitIsbn2SudocIsbn").click(function () {
    $("#results0Isbn,#results1Isbn,#results2Isbn").empty();
    var count0Isbn = 0; var count1Isbn = 0; var count2Isbn = 0;
    var lines = $('textarea#areaIsbn2Sudoc').val().split('\n');
    for (let line of lines) {
      var isbn = line.trim()
      //$.getJSON("https://www.sudoc.fr/services/isbn2ppn/"+lines[i].trim()+"&format=text/json",{}).then(function(data){
      $.getJSON("https://www.sudoc.fr/services/isbn2ppn/" + isbn + "&format=text/json").done(function (data, isbn) {
        console.log(isbn)
        //if(data.sudoc.query.result){}
        if (data.sudoc.query.result.length) {
          console.log(data.sudoc.query.result.length)
          $("#count2Isbn").empty();
          count2Isbn = count2Isbn + 1;
          $("#count2Isbn").append(count2Isbn);
          var arr = []
          data.sudoc.query.result.map(function (d) { return arr.push(d.ppn) })
          $("#results2Isbn").append("<tr><td>" + data.sudoc.query.isbn + "</td><td>" + arr.toString() + "</td></tr>")
        }
        else {
          $("#count1Isbn").empty();
          count1Isbn = count1Isbn + 1;
          $("#count1Isbn").append(count1Isbn);
          $("#results1Isbn").append("<tr><td>" + data.sudoc.query.isbn + "</td><td>" + data.sudoc.query.result.ppn + "</td></tr>")
        }
      })
        .fail(function (jqXHR) {
          console.log(JSON.parse(jqXHR.responseText).sudoc)
          $("#count0Isbn").empty();
          count0Isbn = count0Isbn + 1;
          $("#count0Isbn").append(count0Isbn);
          $("#results0Isbn").append("<tr><td>" + JSON.parse(jqXHR.responseText).sudoc.error + "</td></tr>")
        })
    }
  });
  //clear
  $("#clearIsbn2Sudoc").click(function () {
    $('textarea#areaIsbn2Sudoc').val("");
    $("#results0Isbn,#results1Isbn,#results2Isbn").empty();
  })

  function check_multiwhere(ppn, arr_rcrs) {
    return $.getJSON("https://www.sudoc.fr/services/multiwhere/" + ppn + "&format=text/json").then((data) => {
      var row_arr = ["", "", "", "", "", "", "", "", "", "", "", "", "", ""];
      row_arr.splice(0, 1, ppn);
      if (data.sudoc.query) {
        var resultAllLocs = data.sudoc.query.result.library;
        for (let [pos, rcr] of arr_rcrs) {
          if (Array.isArray(resultAllLocs)) {
            if (resultAllLocs.find(key => rcr.includes(key.rcr))) {
              row_arr.splice(pos, 1, "X");
              //$(`tr#${ppn} td:eq(2)`).append("X")
            }
          }
          else {
            if (rcr.includes(resultAllLocs.rcr)) {
              row_arr.splice(pos, 1, "X");
            }
          }
        }
      }
      else {
        row_arr.splice(1, 1, "X");
      }
      //row_arr.unshift(ppn)
      $("#resultsMultiwhere").append("<tr>" + row_arr.map(d => { return `<td>${d}</td>`; }) + "</tr>");
    });
  }

  /*-- ppn to Sudoc with multiwhere--*/
  $("#submitMultiwherePpn").click(function () {
    $("#resultsMultiwhere").empty();
    const rcrs = [[2, ["060882104"]], //carlone
    [3, ["060882103"]], //droit
    [4, ["060882101"]], //sciences
    [5, ["060882102"]], //médecine
    [6, ["060882105"]], //sja
    [7, ["060882236"]], //staps
    [8, ["061522101"]], //LC
    [9, ["060889901"]], //BIBEL
    [10, ["060882233", "060832201", "060292201"]], //IUT
    [11, ["060882232", "061522202", "060885209"]], //oca
    [12, ["060882304"]], //Villa arson]
    [13, ["060882202"]] // LJAD
    ]
    var lines = $('textarea#areaMultiwhere').val().split('\n');
    for (let line of lines) {
      var ppn = line.trim()
      console.log(ppn)
      //$.getJSON("https://www.sudoc.fr/services/isbn2ppn/"+lines[i].trim()+"&format=text/json",{}).then(function(data){
      check_multiwhere(ppn, rcrs)
    }
  });
  //clear
  $("#clearMultiwhere").click(function () {
    $('textarea#areaMultiwhere').val("");
    $("#resultsMultiwhere").empty();
  })
  
   /*---ppn to Sudoc Unimarc records---*/
  $("#submitUnimarcxmlPpn").click(function () {
    $("#resultsUnimarcxml").empty();
    var lines = $('textarea#areaUnimarcxml').val().split('\n');
    for (let line of lines) {
		 if (line !== "") {
    $.getJSON(getSudocRecordFields, { "ppn":  line.trim() }).then(function (data) {
      $("#resultsUnimarcxml").append("<tr><td>"+data[0].ppn+"</td><td>"+data[0].return_code+"</td><td>"+data[0].type_doc+"</td><td>"+data[0].nnt+"</td><td>"+data[0].titre+"</td></tr>")
    })
		 }
  }
  })
  //clear
  $("#clearUnimarcxml").click(function () {
    $('textarea#areaUnimarcxml').val("");
    $("#resultsUnimarcxml").empty();
  })
})