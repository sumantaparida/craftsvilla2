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
  // json
  $.getJSON('./js/megamenu.json', function(data) {
          var output= "<ul>";
          for (var i in data) {
              var li = '<li>';
              li = li + data[i].name;
              var ulInLi = '<ul>';
              li = li + ulInLi;
              // output+="<li>" + data[i].name + "</li>";
              var innerData = data[i].data;
              for(var j in innerData){
                var innerLi = '<li>'+ innerData[j].name+ '</li>';
                li = li + innerLi;
              //li    li.innerText = ;
              //   ulInLi.appendChild(li)
              }
              li = li + '</li>';
              output = output+ li;
              // li.insert
              // li.appendChild(ulInLi);
              // output.appendChild(li);
              // console.log(data[i].name);
          }
          output+="</ul>";
          document.getElementById("jsonmenu").innerHTML = output;
    });
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
