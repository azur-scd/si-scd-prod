$(function(){
	
	    const years = ["2022"]
    years.map(x => read_dir_files(x))

    function read_dir_files(year) {
        getItems(urlSignalement + "_readdir/" + year).done(function(result){
            return result.map(function(d){$("#files-dirread-" + year).append("<li><a href='"+ urlSignalement + "_export/"+d.file+"'>"+d.file+"</a></li>")})
        })
    }

})