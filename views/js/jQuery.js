$(document).ready(function(){
    //ADDUSER
    $("#adduser").submit( 
    function(e) {
        data =  {   'username': $('verify')
                    
                }
        $.ajax({
            type: 'POST',
            url: '/adduser',
            contentType:"application/json; charset=utf-8",
            data: JSON.stringify(data),
            dataType:"json",
            success: function (data){
                console.log(data);
                if (data.status=='OK'){
                    window.location.href='/'
                } else if (data.status == 'ERROR') {
                    window.location.href='/adduser'
                }
            }
        })
    })

    //
    
});