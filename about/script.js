$(".images img").click(function () {
    $(this).addClass("zoom");
  });
  
  $(".images img").mouseleave(function () {
    $(this).removeClass("zoom");
  });
