jQuery( document ).ready(function($){
if ( self == top ) {
return;
}
 return;   
var php_vars ='';
        jQuery.ajax({
   
                type: 'POST',
                 dataType: 'json',
                url: "/wp-admin/admin-ajax.php",
                
                data: { action: 'get_preview_elemnts',
                  
                       elements: "none",
            
                },       
                success: function (data) {
                  //  debugger;
            if(data.user_id === 0)
                return;
                  var url = data.url;
                    localStorage.setItem('php_vars', JSON.stringify(data));
             
                 jQuery.getScript( url )
  .done(function( script, textStatus ) {
    console.log( textStatus );
                     thisinit();
  })
  .fail(function( jqxhr, settings, exception ) {
                     debugger;
   jQuery( "div.log" ).text( "Triggered ajaxError handler." );
});
        
  //  });
             
    }
            });
             
               
           
        
  });