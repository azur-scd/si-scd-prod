$(function(){
    $("#submit_login").click(function(){
        var username = $("#username").val().trim();
        var password = $("#password").val().trim();

        var userData = {
            username: username,
            password: password
            };
            
            if (!userData.username || !userData.password) {
            alert("champ manquant");
            }
        
            return  $.ajax({
                method: 'POST',
                url: "/login",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: getDataEncoded(userData),
                success: function (response) { 
                    console.log(response)
                    window.location.href = '/admin/docelec/master'
                },
                error : function(response) {console.log(response.statusText);}
            })    
            
    })
})