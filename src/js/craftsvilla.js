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

/* ========================================================================
 * Sumanta Parida: Login
 * ========================================================================
 * Copyright 2016.
 * ======================================================================== */
+function ($) {
  'use strict';

  // LOGIN STRAT
  // ============================================================
  console.log("Login");
  // login popup start
  loginpopup();
  function loginpopup(){
    var header = $("header").outerHeight();
    var logincontent = $(window).height() - header;
    //$(".login-content").style.height = logincontent + "px";
    if($(window).width() <= 768 ) {
      document.getElementById("login-content").style.height = (logincontent + 5) + "px";
      //document.getElementsByClassName("login-content").style.height = logincontent + "px";
    } else {

    }
  }
  // login popup end
}(jQuery);

/* ========================================================================
 * Sumanta Parida: Navigation
 * ========================================================================
 * Copyright 2016.
 * ======================================================================== */
+function ($) {
  'use strict';

  // NAVIGATION START
  // ============================================================
  console.log("Navigation");

}(jQuery);
