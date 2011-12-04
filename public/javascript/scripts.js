$('a.confirm').livequery('click', function(event) { 
  if($(this).title)
    return confirm(this.title);
  else 
    return confirm("Are you sure?");
});

$(document).ready(function() {
    $('table').dataTable();
} );


$(function() {
	$( "#datepicker" ).datepicker();
});

$("a.unHide" ).livequery("click", function(){
  debugger;
  $("#" + $(this).attr("href")).fadeIn();
  return false;
});

