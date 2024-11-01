     var waitToStop = '';

var php_vars ='';
var elements = [];
function thisinit(){
    debugger;
     php_vars = JSON.parse(localStorage.getItem('php_vars'));
 //   php_vars = localStorage.getItem('php_vars');
    if(php_vars.elements != false)
     elements = php_vars.elements;
//var post_id = php_vars.post_id;
    php_vars.post_id = get_current_post_id();
   MakeAllNoetWoRpper();
   GetDb(true);

//notes
    jQuery(document).delegate("body .input_filter", "click", function(e) {
        jQuery(".notes").remove();
        GetDb(true ,jQuery(e.target).attr("data-status"));
        
        });
  jQuery(document).keyup(function(e) {
    debugger;
     if (e.keyCode == 27) { 
        jQuery(".input_note_close_pri").click();
     }      
});

     jQuery(document).delegate("body", "click", function(e) {
         debugger;
        var id = jQuery(e.target).closest(".elementor-element").attr("data-id");
        if (typeof id != 'undefined') 
         MakeNewNotes(id);
         if(jQuery(e.target).hasClass("editor_prev"))
             return;
         jQuery(".pri_activ").removeClass("pri_activ");
         
        });
     jQuery(document).delegate("body .notes", "click", function(e) {
            OpenElement(jQuery(e.target),jQuery(e.target).hasClass("deleteall"));

        });
        jQuery(document).delegate("body .input_note_delete", "click", function(e) {
            DeleteNote(jQuery(e.target),jQuery(e.target).hasClass("deleteall"));
            OpenElement(e.target);

        });
    jQuery(document).delegate("body .input_note_submit", "click", function(e) {
      OpenElement(e.target);
       OnAddCliclk(jQuery(e.target));

        });
//
       jQuery(document).delegate("body .new_note", "keydown", function(e) {
  
        });
      jQuery(document).delegate("body .input_note_completed", "click", function(e) {
   //    debugger;
       Completed(jQuery(e.target));
   OpenElement(e.target);
        });
  jQuery(document).delegate("body .input_note_close_pri", "click", function(e) {

           Close_Pri();
        });
   //input_collaps
       jQuery(document).delegate("body .input_collaps", "click", function(e) {
          // OpenPage();
           jQuery(".notes").remove();
            GetDb(true);
     
        });
    jQuery(document).delegate("body .input_open_page", "click", function(e) {
           OpenPage();
     
        });
     jQuery(document).delegate("body .input_note_open", "click", function(e) {
         UpdateNotes(jQuery(e.target).closest(".notes"));
        //  CloseNote(e.target);
        });
     jQuery(document).delegate("body .input_note_close", "click", function(e) {

          CloseNote(e.target);
        });
     jQuery(document).delegate("body .input_note_readonly", "click", function(e) {
if(jQuery(e.target).hasClass("new_note") || jQuery(e.target).hasClass("input_note_completed"))
    return;
       //  debugger;
          NoteClick(e.target);
         OpenElement(e.target);
        });
 
      jQuery(document).delegate(".pri_body .elementor-element", "hover", function(e) {
      jQuery( ".elementor-element" ).hover(
  function() {
      jQuery(this).addClass("note_hover");
  }, function() {
       jQuery(this).removeClass("note_hover");
  }
);
       

        });
  
}

  function OpenPage(){


       var win = window.open("?notes=active", '_blank');
if (win) {

    win.focus();
} else {

    alert('Please allow popups for this website');
}
    }
  function OpenElement(trgt){

     var  element_id = jQuery(trgt).closest(".notes").attr("data-note");
       if (typeof elementor_id == 'undefined') 
          return;
     var elementor_id =  elements[element_id].element_id;
        
     //   debugger;
        jQuery("div[data-id='"+elementor_id+"']").addClass("pri_activ");

    jQuery([document.documentElement, document.body]).animate({
        scrollTop: jQuery("div[data-id='"+elementor_id+"']").offset().top
    }, 500);

    }
  function DeleteNote(trgt,all){
        debugger;
         var element_id =   trgt.closest(".notes").attr("data-note");
     if(all){

         trgt.closest(".notes").remove();
        elements.splice(element_id,1); 
     }
        else{
           var not_id = trgt.closest("div").prev("textarea").attr("data-note-id");
            elements[element_id].notes.splice(not_id,1);
            UpdateNotes(trgt.closest(".notes"));
        }
      SaveToDb();
    }
  
function Close_Pri(){

    if(jQuery(".editor_prev").hasClass("nutactiv")){
        jQuery(".editor_prev").removeClass("nutactiv");
        jQuery(".submit_open_worpper").addClass("nutactiv");
    }
  
    else{
        jQuery(".note_1").removeClass("note_1"); 
        jQuery(".note_2").removeClass("note_2"); 
     jQuery(".submit_open_worpper").removeClass("nutactiv");   
    jQuery(".editor_prev").addClass("nutactiv");
    }
}
function MakeAllNoetWoRpper(){
    var body = jQuery(".elementor-page");
    body.prepend("<div class='editor_prev'><div class ='submit_div'><input type='submit' value='"+php_vars.text_close+"' class='input_note close input_note_close_pri' /></div><div class ='submit_div'><input type='submit' value='"+php_vars.text_collaps+"' class='input_note input_collaps  close' /><input type='submit' value='"+php_vars.text_open_page+"' class='input_note input_open_page close' /></div><div class ='submit_div'><input type='submit' value='"+php_vars.status_types.activ.display_name+"' data-status='"+php_vars.status_types.activ.code+"' class='input_note input_filter  close' /><input type='submit' value='"+php_vars.status_types.completed.display_name+"' data-status='"+php_vars.status_types.completed.code+"' class='input_note input_filter close' /></div></div>");
  
       var buttons = "<div class ='submit_div submit_open_worpper nutactiv'><input type='submit' value='"+php_vars.text_open+"' class='input_note input_note_close_pri open' /></div>";

    jQuery(buttons).appendTo("body");
}
function SaveToDb(){
        jQuery.ajax({
   
                type: 'POST',
                 dataType: 'json',
                url: "/wp-admin/admin-ajax.php",
                
                data: { action: 'save_preview',
                  
                       elements: elements,
                   
                 
                },       
                success: function (data) {
                  //  debugger;
                }
            });
}
                    
function CheckOwnr(trgt){

    var not_id = jQuery(trgt).attr("data-note-id");
   var element_id =  jQuery(trgt).closest(".notes").attr("data-note"); 
    var notuser = elements[element_id].notes[not_id].user;
    if(php_vars.user_id == notuser)
        return true;
    return false;
}
function Completed(trgt){
     var element_id =  jQuery(trgt).closest(".notes").attr("data-note");
    elements[element_id].status_diaplsy = php_vars.status_types.completed.display_name;
    elements[element_id].status = php_vars.status_types.completed.code;
    jQuery(trgt).closest(".notes").addClass("note_1");
    UpdateNotes(trgt.closest(".notes"));
    SaveToDb();
}
function NoteClick(trgt){
    if(!CheckOwnr(trgt))
        return;
    if(jQuery(trgt).hasClass("activ"))
        return;
      var myhtml =  "<div class ='submit_div'><input type='submit' value='"+php_vars.text_delete+"' class='input_note input_note_delete' /></div>";
    jQuery( myhtml ).insertAfter(trgt );
    jQuery(trgt).addClass("activ");
}
function closeAllNote(){
    jQuery(".notes").each(function(e) {     
       SaveCuuretActiv(jQuery(this));
         CloseNote(this);
     });
}
   function CloseNote(trgt){
        var element_id = jQuery(trgt).attr("data-note");
        if(elements[element_id].notes.length > 0)
             jQuery(trgt).closest( ".elementor-element" ).addClass("note_2");
        else   jQuery(trgt).closest( ".elementor-element" ).removeClass("note_2");
         jQuery(trgt).remove();
    }
 function get_current_post_id(trgt){
     var classList = jQuery(".elementor-page").attr('class').split(/\s+/);
    for (var i = 0; i < classList.length; i++) {
     if (/\d/.test(classList[i])) {
     return classList[i].replace(/[^0-9]/g, '');
        }
    }
         return false;
    }

 function get_post_id(trgt){
                var classList = jQuery(trgt).closest(".elementor").attr('class').split(/\s+/);
        for (var i = 0; i < classList.length; i++) {
       if (/\d/.test(classList[i])) {
       return classList[i].replace(/[^0-9]/g, '');
        }
    }
         return false;
    }
function GetDb(colps = false, filterd_by = false){
       var temp =[];
         for (var i = 0; i < elements.length; i++) {
          if (typeof elements[i].notes != 'undefined') {
                temp.push(elements[i]);    
          }
         }
             elements = temp;
         for (var i = 0; i < elements.length; i++) {
             if(elements[i].post_id === php_vars.post_id && elements[i].status != php_vars.status_types.empty.code){
     jQuery("div[data-id='"+elements[i].element_id+"']").attr("data-note_arr_id",i);
 jQuery("div[data-id='"+elements[i].element_id+"']").addClass("note_"+elements[i].status);
                 if(filterd_by != false && elements[i].status != filterd_by)
                     continue;
                 if(colps)
            MakeColpsWorper(jQuery(".editor_prev"),i,elements[i].status_diaplsy,elements[i].status); 
                 continue;
                MakeWorrper(jQuery(".editor_prev"),i); 
    }
        }
    }
function MakeColpsWorper(trgt,id,status_display,status_code){
debugger;
    trgt.append("<div class = 'notes proventallclick status_"+status_code+"' data-note='"+id+"'></div>");
    
     MakeCollpsNote(jQuery("div[data-note='"+id+"']"),id,status_display);
}
function Marge(element_id){
    var all = [];
    var is = true;
           for (var i = 0; i < elements.length; i++) {
               if(elements[i].element_id === element_id ){
                   is = false;
                   all.concat(elements[i].notes); 
               }
        }
   // if(is)
    return all;
   // return false;
}
function DisplayNote(id,post_id){

    var trgt = jQuery("div[data-id='"+id+"']");

      if (typeof trgt.attr("data-note_arr_id") == 'undefined') {
        var notes =[];
        elements.push({'post_id': php_vars.post_id,'element_id': id,'notes':notes,'status':php_vars.status_types.empty.code,'status_diaplsy':php_vars.status_types.empty.display_name });
        trgt.attr("data-note_arr_id",elements.length - 1);
        MakeWorrper(trgt,elements.length - 1);
        }
    else   MakeWorrper(trgt,trgt.attr("data-note_arr_id"));

}
function MakeWorrper(trgt,id){
    trgt.append("<div class = 'notes proventallclick status_"+elements[id].status+"' data-note='"+id+"'></div>");
    
     MakeNotes(jQuery("div[data-note='"+id+"']"),id);
}
function UpdateNotes(trgt){

    var elements_id = trgt.attr("data-note");
     if (typeof elements[elements_id].notes == 'undefined') 
          return; 
       jQuery("<div class = 'notes proventallclick status_"+elements[elements_id].status+"' data-note='"+elements_id+"'></div>").insertAfter(trgt );
    trgt.remove();
      MakeNotes(jQuery("div[data-note='"+elements_id+"']"),elements_id);

}
function MakeNewNotes(element_id){
 //   debugger;
             for (var i = 0; i < elements.length; i++) {
             if(elements[i].element_id === element_id){
              //open
                 debugger;
                 UpdateNotes(jQuery("div[data-note='"+i+"']"));
                 return;
             }
             }
    jQuery(".status_3").remove();
    jQuery(".add_new_note").remove();
       var notetitle = "<div class='note_title add_new_note'></div>";
    jQuery( notetitle ).insertBefore( ".notes:first" );
      var notes =[];
        elements.push({'post_id': php_vars.post_id,'element_id': element_id,'notes':notes,'status':php_vars.status_types.empty.code,'status_diaplsy':php_vars.status_types.empty.display_name });
    MakeWorrper(jQuery(".add_new_note"),elements.length - 1);

}
function  MakeNotes(trgt,id){
    debugger;
     if (typeof elements[id].notes == 'undefined') 
          return; 
    var notetitle = "<div class='note_title'><p>"+php_vars.note_status+"  "+elements[id].status_diaplsy+"</p></div>";
     jQuery(notetitle).appendTo(trgt);
       for (var i = 0; i < elements[id].notes.length; i++) {
        var note =  MakeNote(i,elements[id].notes[i].type,elements[id].notes[i].val,elements[id].notes[i].user_diaply); 
        jQuery(note).appendTo(trgt);
    }
    jQuery(MakeAddNote(elements[id].notes.length)).appendTo(trgt);
    jQuery(MakeNoteSubmit(elements[id].status)).appendTo(trgt);
}
function SaveNote(trgt_id,id,val){
    elements[trgt_id].notes[id] = val;
    
}
function PushNote(trgt_id,val,type){
       if (typeof elements[trgt_id].notes == 'undefined') 
          return;
    elements[trgt_id].status = "activ";
   var notes = elements[trgt_id].notes;
        notes.push({'val': val, 'type': type,'user': php_vars.user_id,'user_diaply': php_vars.user_diaply_name });

    SaveToDb();
   return notes.length;
}
function SaveCuuretActiv(trgt, key = false){
 // debugger;

    if(key === false){
        var val = trgt.find(".new_note").val();
    }
    else{
    //  var  val = key;
       // trgt = jQuery(trgt).closest(".notes");
        var val = trgt.val();
       // val = val + key;
    }
    if(val === '')
        return;
      var trgt_id = trgt.attr("data-note");
    var type =  trgt.find(".new_note").attr("data-note-type");

  PushNote(trgt_id,val,type);
  
}
function OnAddCliclk(trgt){
  debugger;
   var val = trgt.closest(".notes").find(".new_note").val();
    if(val === '')
        return;
      var trgt_id = trgt.closest(".notes").attr("data-note");
        if (typeof elements[trgt_id].status != 'undefined') {
            debugger;
    elements[trgt_id].status = php_vars.status_types.activ.code;
    elements[trgt_id].status_diaplsy = php_vars.status_types.activ.display_name;
            }
    var type =  trgt.closest(".notes").find(".new_note").attr("data-note-type");
   var new_note_id =  PushNote(trgt_id,val,type);
    trgt.removeClass("new_note");
     trgt.attr("data-note-id",new_note_id);
    trgt.attr("readonly",true);
    
    UpdateNotes(trgt.closest(".notes"));
}
 
function MakeAddNote(id){
    var type = "reply";
    var placeholder =php_vars.text_reply_note;
    if(id === 0){
        type = "note";
          placeholder = php_vars.text_add_note;
        }
     return  "<textarea placeholder='"+placeholder+"'  rows='1' type='text' class='input_note new_note input_type_"+type+"'  data-note-type='"+type+"'  data-note-id='"+id+"' />";
}

function MakeCollpsNote(trgt,id,status){
     var note = "<div class ='submit_div'><input type='submit' value='"+id+" "+status+"' class='input_note input_note_open' /></div>";
    jQuery(note).appendTo(trgt);
}
function MakeNote(id,type,val,user_diaply_name){

   return  "<div class='note_title'><p>"+php_vars.text_note_from+" "+user_diaply_name+"</p></div><textarea type='text' class='input_note input_note_readonly input_type_"+type+"'  data-note-type='"+type+"'  data-note-id='"+id+"' value='"+val+"' readonly >"+val+"</textarea>";
}
function MakeNoteSubmit(status){

    if(status === php_vars.status_types.completed.code)
        return "<div class ='submit_div'><input type='submit' value='"+php_vars.text_save+"' class='input_note input_note_submit' /><input type='submit'  value='"+php_vars.text_delete+"' class='input_note input_note_delete deleteall' /></div>";
      if(status === php_vars.status_types.empty.code)
        return "<div class ='submit_div'><input type='submit' value='"+php_vars.text_save+"' class='input_note input_note_submit' /></div>";
     return  "<div class ='submit_div'><input type='submit' value='"+php_vars.text_save+"' class='input_note input_note_submit' /><input type='submit'  value='"+php_vars.text_completed+"' class='input_note input_note_completed' /></div>";
}
(function($) {
$.fn.exists = function () {
    return this.length !== 0;
}
})(jQuery);

(function($) {
	$(document).ready(function() {
		$('body').append('<div id="autoResizeTextareaCopy" style="box-sizing: border-box; -moz-box-sizing: border-box;  -ms-box-sizing: border-box; -webkit-box-sizing: border-box; visibility: hidden;"></div>');
		var $copy = $('#autoResizeTextareaCopy');

		function autoSize($textarea, options) {
			// The copy must have the same padding, the same dimentions and the same police than the original.
			$copy.css({
				fontFamily:     $textarea.css('fontFamily'),
				fontSize:       $textarea.css('fontSize'),
				padding:        $textarea.css('padding'),
				paddingLeft:    $textarea.css('paddingLeft'),
				paddingRight:   $textarea.css('paddingRight'),
				paddingTop:     $textarea.css('paddingTop'),
				paddingBottom:  $textarea.css('paddingBottom'),
				width:          $textarea.css('width')
			});
			$textarea.css('overflow', 'hidden');

			// Copy textarea contents; browser will calculate correct height of copy.
			var text = $textarea.val()
					.replace('<', '&lt;')
					.replace('>', '&gt;')
					.replace('!', '&excl;')
					.replace('"', '&quot;')
					.replace('$', '&dollar;')
					.replace('#', '&num;')
					.replace('%', '&percnt;')
					.replace('&', '&amp;')
					.replace('\'', '&apos;')

					.replace(/\n/g, '<br />');

			$copy.html(text + '<br /><br />');

			// Then, we get the height of the copy and we apply it to the textarea.
			var newHeight = $copy.css('height');
			$copy.html(''); // We do this because otherwise, a large void appears in the page if the textarea has a high height.

			newHeightI = parseInt(newHeight);
			maxHeight = parseInt(options.maxHeight);
			minHeight = parseInt(options.minHeight);

			if(newHeightI != 0) {
				if((!options.maxHeight || newHeightI < maxHeight) && (!options.minHeight || newHeightI > minHeight)) {
					if(options.animate.enabled) {
						$textarea.animate({
							height: newHeight
						}, {
							duration: options.animate.duration,
							complete: options.animate.complete,
							step:     options.animate.step,
							queue:    false
						});
					}
					else {
						$textarea.css('height', newHeight);
					}

					$textarea.css('overflow-y', 'hidden');
				}
				else {
					$textarea.css('overflow-y', 'scroll');

					if (options.maxHeight && newHeightI >= maxHeight) {
						$textarea.css('height', options.maxHeight);
					}
					else if (options.minHeight && newHeightI <= minHeight)
					{
						$textarea.css('height', options.minHeight);
					}
				}
			}
		}

		$.fn.autoResize = function(options) {
			var $this = $(this),
			    defaultOptions = {
					animate: {
						enabled:   false,
						duration:  100,
						complete:  null,
						step:      null
					},
					maxHeight:     null,
					minHeight:     null
				};

			options = (options == undefined) ? {} : options;
			options = $.extend(true, defaultOptions, options);

			$this.change ( function() { autoSize($this, options); } )
				 .keydown( function() { autoSize($this, options); } )
				 .keyup  ( function() { autoSize($this, options); } )
				 .focus  ( function() { autoSize($this, options); } );

			// No animations on startup
			startupOptions = options;
			startupOptions.animate.enabled = false;
			autoSize($this, startupOptions);
		};
	});
})(jQuery);
    