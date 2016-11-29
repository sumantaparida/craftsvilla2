/* ========================================================================
 * Sumanta Parida: Button Material Effect
 * ========================================================================
 * Copyright 2016.
 * ======================================================================== */
 +function ($) {
   'use strict';
   // BUTTON WAVE EFFECT
   // ============================================================
   console.log("Material Button");
   // Button Effect start
   var ink, d, x, y;
 	$(".ripplelink").click(function(e){
     e.preventDefault();
     setTimeout(function(e) {
       window.location.href = $(this)[0].href;
     }, 600);
     if($(this).find(".ink").length === 0){
         $(this).prepend("<span class='ink'></span>");
     }

     ink = $(this).find(".ink");
     ink.removeClass("animate");

     if(!ink.height() && !ink.width()){
         d = Math.max($(this).outerWidth(), $(this).outerHeight());
         ink.css({height: d, width: d});
     }

     x = e.pageX - $(this).offset().left - ink.width()/2;
     y = e.pageY - $(this).offset().top - ink.height()/2;

     ink.css({top: y+'px', left: x+'px'}).addClass("animate");
   });
 // Effect End

 }(jQuery);
