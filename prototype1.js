$j.fn.textWidth = function(){
	var html_org = $j(this).html();
	var html_calc = $j('<div style="width: 100%"><span>' + html_org + '</span></div>');
	$j(this).html(html_calc);
	var width = $j(this).find('span:first').width();
	$j(this).html(html_org);
	return width;
};

var slClick = function(event) {
	// prevent clicks from reaching other elements
	event.stopPropagation();
	event.preventDefault();
	
	// find the <span> element and extract the wikitext
	var span = $j(this);
	var wiki = span.attr('title');
	
	// calculate width based on the text width witin the page flow
	// this means that this width will never exeed the original width when it's a multiline sentence
	var width = span.textWidth();
	
	// store the original span in a hidden field
	var elOrig = $j('<span class="orig"></span>');
	elOrig.attr('title', wiki);
	elOrig.html(span.html());
	
	// build the input field
	var elInput = $j('<input type="text" style="width: ' + (width-50-60-10) + 'px;"/>');
	elInput.val(wiki);
	
	// build save and cancel buttons and add click events
	var elSave = $j('<input type="button" value="Save" style="width: 50px" class="save"/>');
	var elCancel = $j('<input type="button" value="Cancel" style="width: 60px" class="cancel"/>');
	elSave.click(slCancel);
	elCancel.click(slCancel);
	
	// build the edit bar from the input field and buttons
	var elEditbar = $j('<span class="editbar" style="width: ' + width + 'px"></span>');
	elEditbar.append(elInput);
	elEditbar.append(elSave);
	elEditbar.append(elCancel);
		
	// create a new span and add the original text and the edit bar
	var newSpan = $j('<span class="sentence editing"></span>');
	newSpan.append(elOrig);
	newSpan.append(elEditbar);
	
	// add the new span after the current one, and remove the current one
	// editing the current span is buggy in Webkit browsers
	span.after(newSpan);
	span.remove();
}

var slCancel = function(event) {
	// prevent clicks from reaching other elements
	event.stopPropagation();
	event.preventDefault();
	
	// find the span with class 'sentence', two parents above the buttons
	var span = $j(this).parent().parent();
	
	// find the span with the original value
	var orig = span.children('.orig');
	
	// convert the span to it's original state
	orig.removeClass('orig');
	orig.addClass('sentence')
	orig.bind('click', slClick);
	
	// place the original span after the current span and remove the current span
	// editing the current span is buggy in Webkit browsers
	span.after(orig);
	span.remove();
}

$j(document).ready(function() {
	$j('.sentence').click(slClick);
});