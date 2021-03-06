/* ========================================================================
 * Sumanta Parida: Navigation
 * ========================================================================
 * Copyright 2016.
 * ======================================================================== */
+function ($) {
  'use strict';

  // NAVIGATION START
  // ============================================================
  console.log("Navigation sumanta");
  // Home page Attribute Add
  $(".cms-index-index").attr('page', 'home');
  if($(window).width() < 1005){
    console.log("if");
    // First Click
		$("[first-click]").slice(0,1).addClass("active").next().show();
		$(document).on("click", "a[first-click]", function(event){
			event.preventDefault();
			$("a[first-click]").next().slideUp(400);
			$(this).next().stop(true, false).slideToggle(400);

			if( $(this).hasClass("active") ){
				$(this).removeClass("active");
			} else{
				$("a[first-click]").removeClass("active");
				$(this).addClass("active");
			};
		});
		// Second Click
		$(document).on("click", "a[click-menu]", function(){
			$("a[click-menu]").next().slideUp(200);
			$(this).next().stop(true, false).slideToggle(200);

			if( $(this).hasClass("active") ){
				$(this).removeClass("active");
			} else{
				$("a[click-menu]").removeClass("active");
				$(this).addClass("active");
			};
		});
		/*========*/
		$(".mobile-navbar, span[data-shop-by-close], div[mob-menu-overlay]").on("click", function(event){
			event.stopPropagation();
			$("body").toggleClass("animate-menu");
			$("div[mob-menu-overlay]").fadeToggle( "slow", "linear" );
		});
  }
  else {
    console.log("Else");
    var t, n = !1;
    $(document).on("mouseenter", "ul[data-mega-menu] > li", function(e) {
      // console.log("mouseenter");
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
    }).on("mouseleave", "ul[data-mega-menu] > li", function(e) {
      // console.log("mouseleave");
      var i = $(e.currentTarget).attr("timer");
      clearTimeout(i),
      $(e.currentTarget).removeClass("active").removeAttr("timer"),
      n && (clearTimeout(t),
      t = setTimeout(function() {
          n = !1
      }, 100))
    });
  }
  // json
  $.getJSON('../js/megamenu.json', function(data) {
    var output= "<ul data-mega-menu>";
        output+="<li class='visible-xs hidden-md shop-by'>" + "<span data-shop-by-close class='icon icon-close'></span>" + "</li>";
    for (var i in data) {
      output+="<li>";
      output+="<a first-click href='#sumanta'>" + data[i].name + "<span class='first_arrow icon'></span>" + "</a>";
      var number = '' + i;
      var count = number.length;
      console.log(data[i].name.data);
      // var d = 0;
      if ( data[i].data ) {
        // ====
        console.log( data[i].data )
        output+="<div data-sub-menu>";
        output+="<div class='container sub-menu-wrapper'>";
        output+="<ul>";
        var subData = data[i].data;
        for (var s in subData) {
          output+="<li>";
          output+="<a click-menu>" + subData[s].name + "</a>";
          // ===
          output+="<ul>";
          var nastedData = subData[s].data;
          for (var n in nastedData) {
            output+="<li>";
              output+="<a href=" + nastedData[n].href + ">" + nastedData[n].name + "</a>";
            output+="</li>";
          }
          output+="</ul>";

          // ===
          output+="</li>";
        }
        output+="</ul>";
        output+="</div>";
        output+="</div>";
        // ====
      } else {
        console.log("else");
      }
      output+="</li>";
    }
    output+="</ul>";
    document.getElementsByClassName("navigation-test")[0].innerHTML = output;
  });

}(jQuery);

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
