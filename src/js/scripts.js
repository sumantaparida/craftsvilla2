$(function(){


//
function demo(){
  $.getJSON('megamenu.json', function (data) {
    console.log(data);
    //alert("0");
  });
};
demo();
// login popup
loginpopup();
});
