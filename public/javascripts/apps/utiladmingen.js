$(function () {
    var x = 0; //Initial field counter
    var list_maxField = 10; //Input fields increment limitation

    //Once add button is clicked
    $('.list_add_button').click(function () {
        //Check maximum number of input fields
        if (x < list_maxField) {
            x++; //Increment field counter
            var list_fieldHTML = ' <br><div class="row fieldsrow">' +
                '<div class="col-md-4">' +
                '<div class="form-group">' +
                '<label class="col-md-8 control-label">Période (durée en mois)</label>' +
                '<div class="col-md-4">' +
                '<input type="text" class="form-control" name="list[' + x + '][]" placeholder="ex : 1, 2, 3...">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-4">' +
                '<div class="form-group">' +
                '<label class="col-md-6 control-label">Quotité de temps de travail</label>' +
                '<div class="col-md-6">' +
                '<select class="form-control select" name="list[' + x + '][]" data-style="btn-success">' +
                '<option value="100">100%</option>' +
                '<option value="80">80%</option>' +
				'<option value="70">70%</option>' +
                '<option value="50">50%</option>' +
                '</select>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-2">' +
                '<a href="javascript:void(0);" class="list_remove_button btn btn-danger">Supprimer</a>' +
                '</div>' +
                '</div>';
            $('.list_wrapper').append(list_fieldHTML); //Add field html
        }
    });

    //Once remove button is clicked
    $('.list_wrapper').on('click', '.list_remove_button', function () {
        $(this).closest('div.row').remove(); //Remove field html
        x--; //Decrement field counter
    });
    var total;

    function convert_hours2decimals(hour) {
        var hs = parseInt(hour.split(':')[0])
        var mns = parseInt(hour.split(':')[1]) / 60
        var dec = parseFloat(hs + mns).toFixed(2)
        return dec
    }
    const zeroPad = (num, places) => String(num).padStart(places, '0')
    $('#submitlists').click(function () {
        $("[id^='result_']").empty()
        total = 0
        let conges_annuels_hours = "403:20"
        //let conges_annuels_dec = parseFloat(convert_hours2decimals(conges_annuels_hours)).toFixed(2)
        let conges_mensuels_dec = parseFloat(convert_hours2decimals(conges_annuels_hours) / 12)
        console.log($("[name^='list']").val())
        console.log($("[name^='list'] option:selected").val())
        $('.fieldsrow').each(function () {
            var months = parseInt($(this).find("input[name^='list']").val())
            var quotité = parseInt($(this).find("select[name^='list'] option:selected").val())
            var calcul = parseFloat(months * (quotité * conges_mensuels_dec / 100))
            total += calcul
        });
        $("#result_conges_dec").append("Valeur en décimales : " + parseFloat(total).toFixed(2))
        //$("#result_conges_hours").append(parseInt(total) + "h" + zeroPad(parseInt((total % 1) * 60), 2))
        $("#result_conges_hours").append(parseInt(total) + "h" + zeroPad(Math.round((total % 1) * 60),2))
        console.log(total % 1)
    })
})
