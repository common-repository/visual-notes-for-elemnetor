console.log("redy3"); 
var main_pri ='';
var firsr_init =true;
var aviudbodycliclk = false;
jQuery(window).on( 'elementor/frontend/init', function() {
    
    if (typeof elementor == "undefined" || !firsr_init) {
   return;
}
    loudcss();
    thisinit();
	firsr_init = false;
    });
var  device = 'desktop';
     var waitToStop = '';
var S_EMPTY = 2;
var S_ACTIV = 1;
var S_COM = 0;
var php_vars ='';
var elements = [];
function thisinit(){

    if(php_vars.elements != false)
     elements = php_vars.elements;
    php_vars.post_id = get_current_post_id();
    
   MakeAllNoetWoRpper();
   // return;
	debugger;
   GetDb(true);

//notes
    elementor.$body.delegate(".input_filter", "click", function(e) {
        debugger;
        main_pri.find(".notes").remove();
        GetDb(true ,jQuery(e.target).attr("data-status"));
        main_pri.find(".filter_activ").removeClass("filter_activ");
       jQuery(e.target).addClass("filter_activ");
        
        });
  jQuery(document).keyup(function(e) {
    
     if (e.keyCode == 27) { 
        jQuery(".input_note_close_pri").click();
     }      
});

     elementor.$preview.contents().delegate("body", "click", function(e) {
		 if(aviudbodycliclk)
			 return;
         debugger;
        var id = jQuery(e.target).closest(".elementor-element").attr("data-id");
        if (typeof id != 'undefined') 
         MakeNewNotes(id);
         else return;
         if(jQuery(e.target).hasClass("editor_prev"))
             return;
         jQuery(".pri_activ").removeClass("pri_activ");
         
        });
     elementor.$body.delegate(".notes", "click", function(e) {
         
         e.stopPropagation();
         e.preventDefault();
            OpenElement(jQuery(e.target),jQuery(e.target).hasClass("deleteall"));

        });
        elementor.$body.delegate(".input_note_delete", "click", function(e) {
            
             e.stopPropagation();
         e.preventDefault();
            DeleteNote(jQuery(e.target),jQuery(e.target).hasClass("deleteall"));
            OpenElement(e.target);

        });
    elementor.$body.delegate(".input_note_submit", "click", function(e) {
         e.stopPropagation();
         e.preventDefault();
      OpenElement(e.target);
       OnAddCliclk(jQuery(e.target));

        });
//
       elementor.$body.delegate(".new_note", "keydown", function(e) {
  
        });
      elementor.$body.delegate(".input_note_completed", "click", function(e) {
    e.stopPropagation();
         e.preventDefault();
       Completed(jQuery(e.target));
   OpenElement(e.target);
        });
    elementor.$body.delegate(".elementor-panel-footer-sub-menu-item", "click", function(e){
        
        debugger;
        var buttondevice = jQuery(e.target).closest(".elementor-panel-footer-sub-menu-item").attr("data-device-mode");
        if(typeof buttondevice  == 'undefined' ) 
            return;
        device = buttondevice;
        main_pri.find(".notes").remove();
        GetDb(true);
        
    });
 elementor.$body.delegate(".input_note_close_pri", "click", function(e) {
 e.stopPropagation();
         e.preventDefault();
           Close_Pri();
        });
   //input_collaps
       elementor.$body.delegate(".input_collaps", "click", function(e) {
           e.stopPropagation();
         e.preventDefault();
           main_pri.find(".filter_activ").removeClass("filter_activ");
         //  jQuery(e.target).addClass("filter_activ");        
          main_pri.find(".notes").remove();
		   debugger;
            GetDb(true);
     
        });
    elementor.$body.delegate(".input_open_page", "click", function(e) {
        // e.stopPropagation();
       //  e.preventDefault();
        //   OpenPage();
     
        });
     elementor.$body.delegate(".input_note_open", "click", function(e) {
          e.stopPropagation();
         e.preventDefault();
         
         UpdateNotes(jQuery(e.target).closest(".notes"));
		// OpenElement()
		 ScrullToElement(e.target);
        //  CloseNote(e.target);
        });
     elementor.$body.delegate("body .input_note_close", "click", function(e) {
 e.stopPropagation();
         e.preventDefault();
          CloseNote(e.target);
        });
     elementor.$body.delegate("body .input_note_readonly", "click", function(e) {
if(jQuery(e.target).hasClass("new_note") || jQuery(e.target).hasClass("input_note_completed"))
    return;
        e.stopPropagation();
         e.preventDefault();
          NoteClick(e.target);
         OpenElement(e.target);
        });
 
      elementor.$body.delegate(".pri_body .elementor-element", "hover", function(e) {
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
function ScrullToElement(trgt){
	debugger;
	      var  element_id = jQuery(trgt).closest(".notes").attr("data-note");
       if (typeof element_id == 'undefined' || typeof elements[element_id] == 'undefined') 
          return;
	var elementor_id =  elements[element_id].element_id;
	  //  try{
	   elementor.$preview.contents().children().animate({
        scrollTop:  elementor.$preview.contents().find("div[data-id='"+elementor_id+"']").offset().top
    }, 500);
	aviudbodycliclk = true;
			elementor.$preview.contents().find("div[data-id='"+elementor_id+"']").find(".elementor-editor-element-edit").first().delay( 520 ).click().delay( 20000 );
	aviudbodycliclk = false;
 
    /*  }
      catch{
          console.log("error, but i am a live");
  }*/
}
  function OpenElement(trgt){
   debugger;
      var  element_id = jQuery(trgt).closest(".notes").attr("data-note");
       if (typeof element_id == 'undefined' || typeof elements[element_id] == 'undefined') 
          return;
     var elementor_id =  elements[element_id].element_id;
       var st =  elements[element_id].status;
        elementor.$preview.contents().find(".pri_activ").removeClass("pri_activ");
       
      Updatbody(elementor_id,st);
      MakeNoteIcon(elementor.$preview.contents().find("div[data-id='"+elementor_id+"']"));
      try{
    elementor.$preview.contents().find(document).animate({
        scrollTop:  elementor.$preview.contents().find("div[data-id='"+elementor_id+"']").offset().top
    }, 500);
      }
      catch{
          console.log("error, but i am a live");
  }
    }

function MakeNoteIcon(trgt){
    
    trgt.find(".note_icon").remove();
    trgt.prepend("<i class='note_icon fa fa-pencil'></i>");
}
  function DeleteNote(trgt,all){
        
         var element_id =   trgt.closest(".notes").attr("data-note");
     if(all){
         trgt.closest(".notes").remove();
         Updatbody(elements[element_id].element_id,S_EMPTY);
        elements.splice(element_id,1); 
        
     }
        else{
           var not_id = trgt.closest("div").prev("textarea").attr("data-note-id");
            elements[element_id].notes.splice(not_id,1);
            UpdateNotes(trgt.closest(".notes"));
        }
      SaveToDb();
    }
  function Updatbody(elementor_id,st,none = false){
      
      var element =elementor.$preview.contents().find("div[data-id='"+elementor_id+"']");
    element.addClass("pri_activ");
      for(i=0;i < php_vars.status_types.length; i++){
          if(i == st)
            element.addClass("stustus_"+ php_vars.status_types[i].name);
          else
            element.removeClass("stustus_"+ php_vars.status_types[i].name);
          
      }
if(none){
elementor.$preview.contents().find(".note_icon").remove();
element.removeClass("pri_activ");
}
      
  }
function Close_Pri(){

    if(main_pri.hasClass("nutactiv")){
        main_pri.removeClass("nutactiv");
          main_pri.find(".input_collaps").click();
        jQuery(".submit_open_worpper").addClass("nutactiv");
    }
  
    else{ 
    elementor.$body.find(".submit_open_worpper").removeClass("nutactiv");      
    main_pri.addClass("nutactiv");
    elementor.$preview.contents().find(".note_icon").remove();
    }
   /* if( elementor.$body.find(".submit_open_worpper").hasClass("first")){
         main_pri.find(".input_collaps").click();
        elementor.$body.find(".submit_open_worpper").removeClass("first");
        }*/
}
function loudcss(){
  //  
    
                  jQuery.getScript( php_vars.cssurl )
  .done(function( script, textStatus ) {
    console.log( textStatus );
      	elementor.$body.prepend("<style>" + script + "</style>");
                   //  thisinit();
  })
  .fail(function( jqxhr, settings, exception ) {
                      
  elementor.$body.prepend("<style>" + jqxhr.responseText + "</style>");
                 //    
});
}
function MakeAllNoetWoRpper(){
   var body = elementor.$body;

    body.prepend("<div class='editor_prev nutactiv'><div class ='submit_div pri_submit'><input type='submit' value='"+php_vars.text_close+"' class='input_note close input_note_close_pri' /></div><div class ='submit_div pri_submit'><input type='submit' value='"+php_vars.text_collaps+"' class='input_note input_collaps  close' data-status='-1' /><a href='"+php_vars.url_to_edit+"?post="+php_vars.post_id+"&notes=active' target=\"_blank\"><input type='submit' value='"+php_vars.text_open_page+"' class='input_note input_open_page close' /></a></div><div class ='submit_div pri_submit'><input type='submit' value='"+php_vars.status_types[S_ACTIV].display_name+"' data-status='"+S_ACTIV+"' class='input_note input_filter  close' /><input type='submit' value='"+php_vars.status_types[S_COM].display_name+"' data-status='"+S_COM+"' class='input_note input_filter close' /></div></div>");
  
       var buttons = "<div class ='submit_div submit_open_worpper first'><input type='submit' value='"+php_vars.text_open+"' class='input_note input_note_close_pri open' /></div><div class ='nodes_worpper'></div>";

    jQuery(buttons).appendTo(elementor.$body);
    main_pri = elementor.$body.find(".editor_prev");
}
function Snodes(text){
   var nodes = elementor.$body.find(".nodes_worpper");
    nodes.find("p").remove();
      jQuery(text).appendTo(nodes);
    nodes.addClass("activ");
}
function Hnodes(){
    var nodes = elementor.$body.find(".nodes_worpper");
    nodes.removeClass("activ");

}
function SaveToDb(){
     Snodes("<p><i class=\"fa fa-spinner fa-spin\"></i> "+php_vars.text_save+"</p>");
        jQuery.ajax({
   
                type: 'POST',
                 dataType: 'json',
                url: "/wp-admin/admin-ajax.php",
                
                data: { action: 'save_preview',
                  
                       elements: elements,
                   
                 
                },       
                success: function (data) {
                  // 
                    Hnodes();
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
   if(typeof element_id == 'undefined')
       return;
    elements[element_id].status = S_COM;
    jQuery(trgt).closest(".notes").addClass("note_"+php_vars.status_types[S_COM].name);
    UpdateNotes(trgt.closest(".notes"));
    Updatbody(elements[element_id].element_id,S_COM);
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
    debugger;
         for (var i = 0; i < elements.length; i++) {
          if (typeof elements[i].notes != 'undefined') {
                temp.push(elements[i]);    
          }
         }
             elements = temp;
         for (var i = 0; i < elements.length; i++) {
             if(elements[i].post_id === php_vars.post_id && elements[i].status != S_EMPTY && elements[i].device == device ){
         
                    MakeNoteIcon(elementor.$preview.contents().find("div[data-id='"+elements[i].element_id+"']"));
                    Updatbody(elements[i].element_id,elements[i].status);
                 if(filterd_by !== false && elements[i].status != filterd_by)
                     continue;
                 if(colps)
                MakeColpsWorper(main_pri,i,elements[i].status); 
                 continue;
                 MakeWorrperEditor(main_pri,i); 
    }
        }
    }
function MakeColpsWorper(trgt,id,status_code){

    trgt.append("<div class = 'notes proventallclick status_"+php_vars.status_types[status_code].name+"' data-note='"+id+"'></div>");
  
     MakeCollpsNote(trgt.find("div[data-note='"+id+"']"),id, php_vars. status_types[status_code].display_name);
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
        elements.push({'post_id': php_vars.post_id,'element_id': id,'notes':notes,'status':S_EMPTY,'status_diaplsy':php_vars.status_types[S_EMPTY].display_name,'device': device });
        trgt.attr("data-note_arr_id",elements.length - 1);
        MakeWorrperEditor(trgt,elements.length - 1);
        }
    else   MakeWorrperEditor(trgt,trgt.attr("data-note_arr_id"));

}
function MakeWorrperEditor(trgt,id){
    
    trgt.append("<div class = 'notes proventallclick status_"+elements[id].status+"' data-note='"+id+"'></div>");
    
     MakeNotes(elementor.$body.find("div[data-note='"+id+"']"),id);
}
function UpdateNotes(trgt){

    var elements_id = trgt.attr("data-note");
     if (typeof elements_id  == 'undefined' || typeof elements[elements_id].notes == 'undefined') 
          return; 
       jQuery("<div class = 'notes proventallclick status_"+php_vars.status_types[elements[elements_id].status].name+"' data-note='"+elements_id+"'></div>").insertAfter(trgt );
       trgt.remove();
        MakeNotes(main_pri.find("div[data-note='"+elements_id+"']"),elements_id);
       return main_pri.find("div[data-note='"+elements_id+"']");
}
function acrulltonoet(trgt){
      main_pri.find(document).animate({
        scrollTop:  trgt.offset().top
    }, 500);
}
function MakeNewNotes(element_id){
    
             for (var i = 0; i < elements.length; i++) {
             if(elements[i].element_id === element_id && elements[i].device === device  && elements[i].status != S_EMPTY ){
                main_pri.find(".input_collaps").click();
                Updatbody(elements[i].element_id,elements[i].status);
                MakeNoteIcon(elementor.$preview.contents().find("div[data-id='"+element_id+"']"));
                var newnote =  UpdateNotes(main_pri.find("div[data-note='"+i+"']"));
                newnote.find(".new_note").focus();
                return;
             }
             } 
    var lastsubmit =  main_pri.find( ".pri_submit:last" );
    elementor.$body.find(".status_empty").remove();
    elementor.$body.find(".add_new_note").remove();
    var notetitle = "<div class='note_title add_new_note'></div>";
    jQuery( notetitle ).insertAfter(lastsubmit);
    var notes =[];
    elements.push({'post_id': php_vars.post_id,'element_id': element_id,'notes':notes,'status':S_EMPTY,'status_diaplsy':php_vars.status_types[S_EMPTY].display_name,'device': device });
    MakeWorrperEditor(elementor.$body.find(".add_new_note"),elements.length - 1);
    elementor.$body.find(".new_note").first().focus();
    
Updatbody(elements[i].element_id,elements[i].status);
  MakeNoteIcon(elementor.$preview.contents().find("div[data-id='"+element_id+"']"));
}
function  MakeNotes(trgt,id){
    
     if (typeof elements[id].notes == 'undefined') 
          return; 
    var notetitle = "<div class='note_title'><p>"+php_vars.note_status+"  "+php_vars.status_types[elements[id].status].display_name+"</p></div>";
     jQuery(notetitle).appendTo(trgt);
       for (var i = 0; i < elements[id].notes.length; i++) {
              
          
        var note = MakeNote(i,elements[id].notes[i].type,elements[id].notes[i].val,elements[id].notes[i].user_diaply); 
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
    elements[trgt_id].status = S_ACTIV;
   var notes = elements[trgt_id].notes;
        notes.push({'val': val, 'type': type,'user': php_vars.user_id,'user_diaply': php_vars.user_diaply_name });

    SaveToDb();
   return notes.length;
}
function SaveCuuretActiv(trgt, key = false){
 // 

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

   var val = trgt.closest(".notes").find(".new_note").val();
    if(val === '')
        return;
      var trgt_id = trgt.closest(".notes").attr("data-note");
        if (typeof trgt_id != 'undefined' || typeof elements[trgt_id].status != 'undefined') {
           
           elements[trgt_id].status = S_ACTIV;
           elements[trgt_id].status_diaplsy = php_vars.status_types[S_ACTIV].display_name;
            }
    var type =  trgt.closest(".notes").find(".new_note").attr("data-note-type");
   var new_note_id =  PushNote(trgt_id,val,type);
    trgt.removeClass("new_note");
     trgt.attr("data-note-id",new_note_id);
    trgt.attr("readonly",true);
    Updatbody(elements[trgt_id].element_id,S_ACTIV);
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

   status = parseInt(status);
    if(status === parseInt(S_COM))
        return "<div class ='submit_div'><input type='submit' value='"+php_vars.text_save+"' class='input_note input_note_submit' /><input type='submit'  value='"+php_vars.text_delete+"' class='input_note input_note_delete deleteall' /></div>";
      if(status === parseInt(S_EMPTY))
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
    
