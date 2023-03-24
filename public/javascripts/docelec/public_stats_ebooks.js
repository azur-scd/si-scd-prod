$(function(){
    getItems(urlSignalement + "_readdir").done(function(result){
        return result.map(function(d){$("#files-dirread").append("<li><a href='"+ urlSignalement + "_export/"+d.file+"'>"+d.file+"</a></li>")})
    })

})