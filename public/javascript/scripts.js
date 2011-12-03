$('a.confirm').livequery('click', function(event) { 
	if($(this).title)
		return confirm(this.title);
	else 
		return confirm("Are you sure?");
});
