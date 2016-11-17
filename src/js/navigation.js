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
  if($(window).width() < 1005){
    console.log("if");
  }
  else {
    console.log("Else");
    var t, n = !1;
    $("ul[data-mega-menu] > li").mouseenter(function(e) {
      console.log("mouseenter");
      if (n) {
        clearTimeout(t),
        $(e.currentTarget).removeClass("active").addClass("active"),
        n = !0;
      } else {
        var i = setTimeout(function() {
            clearTimeout(t),
            $(e.currentTarget).removeClass("active").addClass("active"),
            n = !0
        }, 400);
        $(e.currentTarget).attr("timer", i)
      }
    }).mouseleave(function(e) {
      console.log("mouseleave");
      var i = $(e.currentTarget).attr("timer");
      clearTimeout(i),
      $(e.currentTarget).removeClass("active").removeAttr("timer"),
      n && (clearTimeout(t),
      t = setTimeout(function() {
          n = !1
      }, 100))
    });
  }

}(jQuery);
