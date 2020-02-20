var videoURL = "https://mediaplayer.pearsoncmg.com/assets/_video.true/";
var audioURL = "https://mediaplayer.pearsoncmg.com/assets/_audio.true/";

jQuery(document).ready(function() {
     "use strict";
	jQuery('.accordion-title-link[class*=-widget]').click(function(e) {
          e.preventDefault();
          var targetPannelId = jQuery(this).attr('href');
          if(jQuery(this).is('.active')) {
               closeAccordion(this,targetPannelId);
          }
          else {
               openAccordion(this,targetPannelId);
          }
	});
});

function closeAccordion(targetElement,targetPannelId) {
     "use strict";
     jQuery(targetElement).removeClass('active');
     jQuery(targetElement).attr("aria-expanded" , "false");
     jQuery('.accordion ' + targetPannelId).slideUp(300).attr("aria-hidden", "true");
     var currentIframes = jQuery(targetPannelId + ' iframe');
     var i;
     if (currentIframes.length>0){
          for (i = 0; i < currentIframes.length; i++) {
               jQuery(currentIframes[i]).attr('src',"");
          }
     }
     else {   
     }
}

function openAccordion(targetElement,targetPannelId){
     "use strict";
     jQuery(targetElement).addClass('active');
     jQuery(targetElement).attr("aria-expanded" , "true");
     jQuery('.accordion ' + targetPannelId).slideDown(300).attr("aria-hidden", "false");
     var currentIframes = jQuery(targetPannelId + ' iframe');
     var i;
     var playerType;
     var finalURL;
     if (currentIframes.length>0){
          for (i = 0; i < currentIframes.length; i++) {
               playerType="";
               playerType = jQuery(currentIframes[i]).data("player-type");
               if (playerType === "audio") {
                    finalURL = "";
                    finalURL = audioURL + jQuery(currentIframes[i]).data("spp-id"); 
                    jQuery(currentIframes[i]).attr('src', finalURL);
               }
               else if (playerType === "video"){
                    finalURL = "";
                    finalURL = videoURL + jQuery(currentIframes[i]).data("spp-id"); 
                    jQuery(currentIframes[i]).attr('src', finalURL);
               }
          }
     }
     else {    
     }
}

//var currentAttrValue = jQuery(this).attr('href');
//          if(jQuery(this).is('.active')) {

//               var currentElement = jQuery(currentAttrValue + ' iframe');
//               var i;
//               var temp_element;
//               var temp_value;
//               for (i = 0; i < currentElement.length; i++) {
//                    temp_value = "";
//                    temp_element = "";
//                    temp_element = currentElement[i];
//                    temp_value = jQuery(temp_element).attr("src");
//                    jQuery(temp_element).attr("src", "");
//                    jQuery(temp_element).attr("src", temp_value);
//               }
//               console.log("Entered IF Condition");
//          }
//          else {
//			jQuery(this).addClass('active');
//               var currentElement_i = jQuery(currentAttrValue + ' iframe');
//               var i_i;
//               var temp_element_i;
//               var temp_value_i;
//               for (i_i = 0; i_i < currentElement_i.length; i_i++) {
//                    temp_value_i = "";
//                    temp_element_i = "";
//                    temp_element_i = currentElement_i[i_i];
//                    temp_value_i = jQuery(temp_element_i).attr("src");
//                    jQuery(temp_element_i).attr("src", "");
//                    jQuery(temp_element_i).attr("src", temp_value_i);
//               }
//			jQuery('.accordion ' + currentAttrValue).slideDown(300).attr("aria-hidden", "false");
//               jQuery(this).attr("aria-expanded" , "true");
//               console.log("Did not enter IF Condition");
//          }


//$(document).ready(function() {
//  var topic_s = sessionStorage.topic;
//  var module_s = sessionStorage.module;
//
//  if (topic_s !== "undefined" && topic_s !== undefined && topic_s !== "null" && topic_s !== null) {
//
//    if ($("#index").length > 0) {
//     $('#' + topic_s).toggleClass("chapterItems-clicked");
//     $('#' + topic_s).next(".chapterItems").show();
//
//     $("span", '#' + topic_s).toggleClass("fa-caret-right fa-caret-down");
//     (document.getElementById(topic_s).setAttribute('aria-expanded', true));
//    }
//  }
//
//  if (typeof module_s !== undefined && module_s !== "null") {
//    window.location.hash = module_s;
//  }
//
//  $(".chapterTitles").click(function() {
//    showHide(this, ".chapterItems", "chapterItems-clicked");
//    $("span", this).toggleClass("fa-caret-right fa-caret-down");
//  });
//
//  $("#index").on('click', 'a', function() {
//    var module = $(this).closest('div').attr('id');
//    sessionStorage.setItem("module", module);
//  });
//
//  $(".example-title").click(function() {
//    showHide(this, ".example-content", "example-title-click");
//  });
//
//  $(function() {
//    $(".click-expand").click(function() {
//      showHide(this, ".expand-example", "click-expanded");
//    });
//  });
//
//  $('li').each(function() {
//    this.innerHTML = "<span>" + this.innerHTML + "</span>"
//  });
//
//});
//
//function showHide(that, content, add_class) {
//  $(that).next(content).slideToggle('500');
//  $(that).toggleClass(add_class);
//  var expandedValue = $(that).attr('aria-expanded');
//	var hiddenValue = $(that).next(content).attr('aria-hidden');
//
//  if (expandedValue == 'true') {
//    expandedValue = 'false';
//		hiddenValue = 'true'; 
//    sessionStorage.setItem("topic", null);
//  } else if (expandedValue == 'false') {
//    expandedValue = 'true';
//		hiddenValue = 'false';
//    if (content === ".chapterItems")
//      sessionStorage.setItem("topic", that.id);
//  }
//	
//	
//	
//  $(that).attr('aria-expanded', expandedValue);
//	$(that).next(content).attr('aria-hidden', hiddenValue);
//}
//
//function printPage() {
//  $('.expand-example').each(function(i) {
//    if ($(this).attr('style') === 'display: none;')
//      $(this).removeAttr('style');
//  });
//  $('.example-content').each(function(i) {
//    if ($(this).attr('style') === 'display: none;')
//      $(this).removeAttr('style');
//  });
//  window.print();
//}
//
//
//
//function resizeIFrame(id) {
//  var newheight;
//  var newwidth;
//
//  try {
//    var elem = (document.getElementById) ? document.getElementById(id) : ((document.all) ? document.all[id] : null);
//
//    if (elem) {
//      //  		if((navigator.platform.indexOf("iPad") != -1) || (navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1)){
//      //  			return;
//      //			}
//
//      if ($.browser.safari || $.browser.opera) {
//        newwidth = elem.contentWindow.document.body.offsetWidth;
//        newheight = elem.contentWindow.document.body.offsetHeight + 12;
//      } else {
//        newwidth = elem.contentWindow.document.body.scrollWidth;
//        newheight = elem.contentWindow.document.body.scrollHeight + 12;
//      }
//
//      elem.width = (newwidth) + "px";
//      elem.height = (newheight) + "px";
//
//      if ($("#player").hasClass("playerFixedTop")) {
//        $(".roundedCornerBox").css("margin-top", $("#_chapterAudio").height());
//      }
//    }
//  } catch (error) {}
//}
