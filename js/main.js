     var waitToStop = '';
if(php_vars.elements == false)
var elements = [];
else elements = php_vars.elements;
var S_EMPTY = 2;
var S_ACTIV = 1;
var S_COM = 0;
var  device = '';
var label_triggers =[];
jQuery(document).ready(function($) {
   // 
    GetDevice();
  var buttons = "<div class ='nodes_worpper'></div>";
 jQuery(buttons).appendTo("body");
 
    GetDb();
jQuery(document).delegate("body", "click", function(e) {
    
     if(jQuery(e.target).closest("#wpadminbar").exists() || jQuery(e.target).attr("id") === "wpadminbar" )
        return;
    e.preventDefault();
    e.stopPropagation();
     if(jQuery(e.target).parent(".proventallclick").exists())
        return;
    closeAllNote();
     var id =  jQuery(e.target).closest(".elementor-element").attr("data-id");

       if (typeof id == 'undefined') 
          return; 
   
        post_id = get_post_id(e.target);

    DisplayNote(id,post_id,e.pageX,e.pageY);
  
        });
  
        jQuery(window).on('resize', function(){
   GetDevice();
            GetDb();
});
        jQuery(document).delegate("body .input_note_delete", "click", function(e) {
            DeleteNote(jQuery(e.target),jQuery(e.target).hasClass("deleteall"));

        });
    jQuery(document).delegate("body .input_note_submit", "click", function(e) {
       
        e.preventDefault();
        e.stopPropagation();
       OnAddCliclk(jQuery(e.target));
       //  post_id = get_post_id(e.target);
       // DisplayNote(jQuery(e.target).closest(".elementor-element").attr("data-id"),post_id);
        });
//
       jQuery(document).delegate("body .new_note", "keydown", function(e) {
   
   
        });
      jQuery(document).delegate("body .input_note_completed", "click", function(e) {
   //    
       Completed(jQuery(e.target));
   
        });
//function Completed(trgt){
     jQuery(document).delegate("body .input_note_close", "click", function(e) {

          CloseNote(e.target);
        });
     jQuery(document).delegate("body .input_note_readonly", "click", function(e) {
         
if(jQuery(e.target).hasClass("new_note") || jQuery(e.target).hasClass("input_note_completed"))
    return;
         
         e.stopPropagation();
         e.preventDefault();
       //  
          NoteClick(e.target);
        });
 
      jQuery(document).delegate(".elementor-element", "hover", function(e) {
      jQuery( ".elementor-element" ).hover(
  function() {
      jQuery(this).addClass("note_hover");
  }, function() {
       jQuery(this).removeClass("note_hover");
  }
);
       

        });
  
   
        });
function Snodes(text){
    jQuery(".nodes_worpper").find("p").remove();
      jQuery(text).appendTo(".nodes_worpper");
    jQuery(".nodes_worpper").addClass("activ");
}
function Hnodes(){
    jQuery(".nodes_worpper").removeClass("activ");

}
  function DeleteNote(trgt,all){
        
         var element_id =   trgt.closest(".elementor-element").attr("data-note_arr_id");
     if(all){
         debugger;
         trgt.closest(".elementor-element").removeClass("note_"+php_vars.status_types[S_ACTIV].name);
            trgt.closest(".elementor-element").removeClass("note_"+php_vars.status_types[elements[element_id].status].name);
       //  trgt.closest(".elementor-element").removeClass("note_1");
         trgt.closest(".elementor-element").removeAttr("data-note_arr_id");
         
         trgt.closest(".elementor-element").find(".notes").remove();
    
        elements.splice(element_id,1); 
     }
        else{
           var not_id = trgt.closest("div").prev("textarea").attr("data-note-id");
            elements[element_id].notes.splice(not_id,1);
        }
      SaveToDb();
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
                   Hnodes();
                  //  
                }
            });
}
                    
function CheckOwnr(trgt){
    
    var not_id = jQuery(trgt).attr("data-note-id");
   var element_id =  jQuery(trgt).closest(".elementor-element").attr("data-note_arr_id");
   
    var notuser = elements[element_id].notes[not_id].user;
    if(php_vars.user_id == notuser)
        return true;
    return false;
}
function MakeNoteIcon(trgt){
    trgt.prepend("<i class='note_icon fa fa-pencil'></i>");
}
function Completed(trgt){
    
   // 0 =com 1 = activ 3 = empty
     var element_id =  jQuery(trgt).closest(".elementor-element").attr("data-note_arr_id");
    elements[element_id].status = S_COM;
    elements[element_id].status_diaplsy = php_vars.status_types[S_COM].display_name;
    jQuery(trgt).closest(".elementor-element").removeClass("note_"+php_vars.status_types[S_ACTIV].name);
    jQuery(trgt).closest(".elementor-element").addClass("note_"+php_vars.status_types[S_COM].name);
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
             jQuery(trgt).closest( ".elementor-element" ).addClass("note_"+php_vars.status_types[elements[element_id].status].name);
        else{   jQuery(trgt).closest( ".elementor-element" ).removeClass("note_"+php_vars.status_types[S_COM].name);
             jQuery(trgt).closest( ".elementor-element" ).removeClass("note_"+php_vars.status_types[S_ACTIV].name);
             }
         jQuery(trgt).remove();
    }
 function get_post_id(trgt){
  //   
                var classList = jQuery(trgt).closest(".elementor").attr('class').split(/\s+/);
        for (var i = 0; i < classList.length; i++) {
       if (/\d/.test(classList[i])) {
       return classList[i].replace(/[^0-9]/g, '');
        }
    }
         return false;
    }
function GetDb(){
    
    var temp =[];
         for (var i = 0; i < elements.length; i++) {
          if (typeof elements[i].notes != 'undefined') {
                temp.push(elements[i]);    
          }
         }
             elements = temp;
              for (var i = 0; i < elements.length; i++) {
                  if(elements[i].device != device)
                      continue;
 jQuery("div[data-id='"+elements[i].element_id+"']").attr("data-note_arr_id",i);
//
jQuery("div[data-id='"+elements[i].element_id+"']").addClass("note_"+php_vars.status_types[elements[i].status].name);
   MakeNoteIcon(jQuery("div[data-id='"+elements[i].element_id+"']"));

        }
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
function DisplayNote(id,post_id,x =0,y =0){
 //   
    var trgt = jQuery("div[data-id='"+id+"']");
var main_note_id = trgt.attr("data-note_arr_id");
      if (typeof main_note_id == 'undefined' || elements[main_note_id].device != device ) {
        var notes =[];
        elements.push({'post_id': post_id,'element_id': id,'notes':notes,'status':S_EMPTY,'status_diaplsy':php_vars.status_types[S_EMPTY].display_name,'device': device });
        trgt.attr("data-note_arr_id",elements.length - 1);
      //  MakeWorrper(trgt,elements.length - 1);
          MakeFixWorrper(trgt,elements.length - 1,x,y);
        }
    else   MakeFixWorrper(trgt,trgt.attr("data-note_arr_id"),x,y);
   // jQuery("div[data-id='"+id+"']").append("<input data-note='"+trgt+"'>");
}
function MakeWorrper(trgt,id){
 ///   
    trgt.find(".notes").remove();
    trgt.append("<div class = 'notes proventallclick' data-note='"+id+"'></div>");
    
     MakeNotes(jQuery("div[data-note='"+id+"']"),id);
}
function MakeFixWorrper(trgt,id,x,y){
    

    trgt.find(".notes").remove();
    trgt.append("<div class = 'notes fixed  proventallclick'  data-note='"+id+"'></div>");
   // setfixpotition(jQuery("div[data-note='"+id+"']"),x,y)
     MakeNotes(jQuery("div[data-note='"+id+"']"),id);
    trgt.find(".new_note").focus();
}
function setfixpotition(trgt,x,y){
    
    xPercent = x / jQuery( window ).width() * 100;
    yPercent = y / jQuery( window ).height() * 100;
    trgt.css("top",yPercent+"%");
    trgt.css("left",xPercent+"%");
    var offset = trgt.offset();
      if (typeof offset == 'undefined') {
        trgt.css("left",jQuery( window ).width()-300+"px");
    }


}
function  MakeNotes(trgt,id){
    var note_dev = device;
    var status = '';
    if (typeof elements[id] == 'undefined') {
     
        status = php_vars.status_types[S_EMPTY].display_name;
    }// 
    else {
           note_dev = elements[id].device;
        status = php_vars.status_types[elements[id].status].display_name;
       
    }
    //<i class="fa fa-tablet" aria-hidden="true"></i>
    var notetitle = "<div class='note_title'><i class=\"fa fa-"+note_dev+"\"></i><p>"+php_vars.note_status+"  "+status+"</p></div>";
     jQuery(notetitle).appendTo(trgt);
       for (var i = 0; i < elements[id].notes.length; i++) {
          
           var note =  MakeNote(i,elements[id].notes[i].type,elements[id].notes[i].val,elements[id].notes[i].user_diaply); 
      //     
        jQuery(note).appendTo(trgt);
    }
    jQuery(MakeAddNote(elements[id].notes.length)).appendTo(trgt);
    jQuery(MakeNoteSubmit(elements[id].status)).appendTo(trgt);
    jQuery('textarea').autoResize();
}
function SaveNote(trgt_id,id,val){
    elements[trgt_id].notes[id] = val;
}
function GetDevice(){
 var win =   jQuery(window).width();
     device = "desktop";
    if(win < php_vars.device.tablet_width){
        device = "tablet";
    if(win < php_vars.device.mobile_width)
        device = "mobile";
        
   }
}
function PushNote(trgt_id,val,type){

    elements[trgt_id].status = S_ACTIV;
   var notes = elements[trgt_id].notes;
    notes.push({'val': val, 'type': type,'user': php_vars.user_id,'user_diaply': php_vars.user_diaply_name });
    SaveToDb();
   return notes.length;
}
function SaveCuuretActiv(trgt, key = false){

    if(key === false){
        var val = trgt.find(".new_note").val();
    }
    else{
        var val = trgt.val();

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
    var type =  trgt.closest(".notes").find(".new_note").attr("data-note-type");
    var hold_new =  trgt.closest(".notes").find(".new_note");
      var new_note_id =  PushNote(trgt_id,val,type);
    jQuery(MakeNote(new_note_id - 1,type,val,php_vars.user_diaply_name)).insertBefore(hold_new);
    
   //new_note
    trgt.closest(".notes").find(".submit_div").remove();
     jQuery(MakeNoteSubmit(S_ACTIV)).insertAfter(hold_new);
    jQuery(MakeAddNote(1)).insertAfter(hold_new);
     hold_new.remove();
    jQuery("div[data-id='"+elements[trgt_id].element_id+"']").addClass("note_"+php_vars.status_types[S_ACTIV].name);
     MakeNoteIcon(jQuery("div[data-id='"+elements[trgt_id].element_id+"']"));

    
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
//$('textarea').autoResize();

function MakeNote(id,type,val,user_diaply_name,dev){
       // var notetitle = "<div class='note_title'><p>"+php_vars.text_note_from+" "+user_diaply_name+"</p></div>";
   return  "<div class='note_title'><i class=\"fa fa-"+dev+"\"></i><p>"+php_vars.text_note_from+" "+user_diaply_name+"</p></div><textarea type='text' class='input_note input_note_readonly input_type_"+type+"'  data-note-type='"+type+"'  data-note-id='"+id+"' value='"+val+"' readonly >"+val+"</textarea>";
}
function MakeNoteSubmit(status){
    
   // "completed"
   // parseInt
    if(parseInt(status) === S_COM)
        return "<div class ='submit_div'><input type='submit' value='"+php_vars.text_save+"' class='input_note input_botton input_note_submit' /><input type='submit'  value='"+php_vars.text_delete+"' class='input_note input_note_delete deleteall' /></div>";
     return  "<div class ='submit_div'><input type='submit' value='"+php_vars.text_save+"' class='input_note input_botton input_note_submit' /><input type='submit'  value='"+php_vars.text_completed+"' class='input_note input_botton input_note_completed' /></div>";
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
function PopupHover(id){

    for (var i = 0; i < label_triggers.length; i++) {
       if(label_triggers[i].trigger === id && label_triggers[i].event === "hover"){
           var animation_time = parseInt(label_triggers[i].animation_time);
            var display_time = parseInt(label_triggers[i].display_time);
             var side = label_triggers[i].side;
              HideAndShow( jQuery("#"+label_triggers[i].label),side,animation_time,display_time);
            break;
        }
    }
}
function PopupSubmit(id){
    for (var i = 0; i < label_triggers.length; i++) {
       if(label_triggers[i].trigger === id && label_triggers[i].event === "submit"){
             var animation_time = parseInt(label_triggers[i].animation_time);
            var display_time = parseInt(label_triggers[i].display_time);
            var side = label_triggers[i].side;
              HideAndShow( jQuery("#"+label_triggers[i].label),side,animation_time,display_time);
            break;
        }
    }
}
function PopupClick(id){
    for (var i = 0; i < label_triggers.length; i++) {
       if(label_triggers[i].trigger === id && label_triggers[i].event === "click"){
             var animation_time = parseInt(label_triggers[i].animation_time);
            var display_time = parseInt(label_triggers[i].display_time);
            var side = label_triggers[i].side;
              HideAndShow( jQuery("#"+label_triggers[i].label),side,animation_time,display_time);
            break;
        }
    }
}
function PopupScroll(){
    
    for (var i = 0; i < label_triggers.length; i++) {
      // 
        if(label_triggers[i].event != "scroll")
            continue;
     
          var label = jQuery("#"+label_triggers[i].label);
        var trigger = jQuery("#"+label_triggers[i].trigger);
        if(isScrolledIntoView(trigger)){
               var animation_time = parseInt(label_triggers[i].animation_time);
            var side = label_triggers[i].side;
            if(label.hasClass("currentlyanimated"))
             return;
               
            var display_time = parseInt(label_triggers[i].display_time);
            HideAndShow( label,side,animation_time,display_time);
         //   jQuery("#"+label_triggers[i].label).css("display","block");
         //   break;
        }
        else {
                  var animation_time = parseInt(label_triggers[i].animation_time);
            var side = label_triggers[i].side;
            if(label.hasClass("currentlyanimated"))
              return;
       PopupHide( label,side,animation_time);
        }
    }
}
function PopupHide(id,action,animationtime){
        if(!id.hasClass("activ"))
        return;
     id.removeClass("activ");
     id.addClass("currentlyanimated");
     if(action === "right"){
     id.animate({
    "margin-right": "-=100%",
  }, animationtime, function() {
 id.removeClass("currentlyanimated");
        
});
     }
         if(action === "left"){
     id.animate({
    "margin-left": "-=100%",
  }, animationtime, function() {
 id.removeClass("currentlyanimated");
        
});
     }
}
function HideAndShow(id,action,animationtime,time){
     if(id.hasClass("activ"))
        return;
  //  
     clearTimeout(waitToStop);
    jQuery(".popuplabels").find(".activ").each(function(){ 
        PopupHide(jQuery(this),action,animationtime,time);
        });
      setTimeout(PopupShow, animationtime,id,action,animationtime,time);
}
function PopupShow(id,action,animationtime,time){
  //  
    if(id.hasClass("activ"))
        return;
     id.addClass("activ");
     id.addClass("currentlyanimated");
    if(action === "right"){
     id.animate({
    "margin-right": "+=100%",
  }, animationtime, function() {
      //   
 id.removeClass("currentlyanimated");
waitToStop =   setTimeout(PopupHide, time,id,action,animationtime);
});
        }
    if(action === "left"){
             id.animate({
    "margin-left": "+=100%",
  }, animationtime, function() {
       //  
 id.removeClass("currentlyanimated");
 setTimeout(PopupHide, time,id,action,animationtime);
});
    }
   
}
function isScrolledIntoView(elem){

    //if(!jQuery(elem).length)
      //  return true;
    var docViewTop = jQuery(window).scrollTop();
    var docViewBottom = docViewTop + jQuery(window).height();

    var elemTop = jQuery(elem).offset().top;
    var elemBottom = elemTop + jQuery(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}      