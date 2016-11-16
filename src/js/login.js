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
