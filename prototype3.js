// function declarations
var slClick;
var slPreview;
var slCancel;
var slEditMode;

$j.fn.textWidth = function(){
	var element = $j(this);
	
	// build an outer element that stretches to the maximum width, so the span will
	// be located to the leftmost position
	var outer = $j('<div style="width: 100%"></div>');
	
	// build a span inside the outer div
	var inner = $j('<span></span>');
	inner.html(element.html());
	outer.append(inner);
	
	// place the outer div after the original element and hide the original element so it'll
	// be in exactly the same place
	element.after(outer);
	element.hide();
	
	// calculate the div of the span (which will wrap when it meets the maximum width)
	var width = inner.width();
	
	// remove the test elements and show the original element again
	outer.remove();
	element.show();
	
	return width;
};

slClick = function(event) {
	if (!$j('#content').hasClass('modeText')) {
		return;
	}
	
	// prevent clicks from reaching other elements
	event.stopPropagation();
	event.preventDefault();
	
	// find the <span> element and extract the wikitext
	var span = $j(this);
	var wiki = span.attr('title');
	
	// calculate width based on the text width witin the page flow
	// this means that this width will never exeed the original width when it's a multiline sentence
	var width = span.textWidth() - 5;
	
	// store the original span in a hidden field
	var elOrig = $j('<span class="orig"></span>');
	elOrig.attr('title', wiki);
	elOrig.html(span.html());
	
	// build the input field
	var elInput = $j('<textarea style="width: ' + (width-60-60-10) + 'px;"></textarea>');
	elInput.text(wiki);
	
	// build preview and cancel buttons and add click events
	var elPreview = $j('<input type="button" value="Preview" style="width: 60px; margin-left: ' + (3) + 'px;" class="preview"/>');
	var elCancel = $j('<input type="button" value="Cancel" style="width: 60px; margin-left: ' + (60+3+3) + 'px;" class="cancel"/>');
	elPreview.click(slPreview);
	elCancel.click(slCancel);
	
	// build the edit bar from the input field and buttons
	var elEditbar = $j('<span class="editbar" style="width: ' + width + 'px"></span>');
	elEditbar.append(elInput);
	elEditbar.append(elPreview);
	elEditbar.append(elCancel);
		
	// create a new span and add the original text and the edit bar
	var newSpan = $j('<span class="sentence editing"></span>');
	newSpan.append(elOrig);
	newSpan.append(elEditbar);
	
	// add the new span after the current one, and remove the current one
	// editing the current span is buggy in Webkit browsers
	span.after(newSpan);
	span.remove();
	
	// automatically resize the textarea using the Elastic plugin
	elInput.elastic();
	
	// focus on the input so you can start typing immediately
	elInput.focus();
};

slCancel = function(event) {
	// prevent clicks from reaching other elements
	event.stopPropagation();
	event.preventDefault();
	
	// find the span with class 'sentence', two parents above the buttons
	var span = $j(this).parent().parent();
	
	// find the span with the original value
	var orig = span.children('.orig');
	
	// convert the span to it's original state
	orig.removeClass('orig');
	orig.addClass('sentence');
	orig.bind('click', slClick);
	
	// place the original span after the current span and remove the current span
	// editing the current span is buggy in Webkit browsers
	span.after(orig);
	span.remove();
	
	// highlight the text orange and have it fade to blue again
	// this is a visual indicator to where the sentence is now
	orig.addClass('fadeHighlight');
	orig.removeClass('fadeHighlight', 'slow');
};

slPreview = function(event) {
	// prevent clicks from reaching other elements
	event.stopPropagation();
	event.preventDefault();
	
	// find the span with class 'editbar', two parents above the buttons
	var editbar = $j(this).parent();
	
	// add a visual indicator to show the preview is loading 
	editbar.parent().addClass('saving');
	var overlay = $j('<div class="overlay"><div class="alpha"></div><img class="spinner" src="ajax-loader.gif"/></div>');
	editbar.append(overlay);
	
	// mark the original text as being changed, this will give a colored highlight
	editbar.parent().children('.orig').addClass('editedHighlight');
	
	// fake the retrieval of data
	setTimeout(function() { editbar.children('.cancel').click(); }, 300 + 1000 * Math.random() );
};

slEditMode = function(event) {
	// first of all, hide all descriptions, remove the edit mode from #content,
	// and cancel all sentences that are being edited
	$j('.editmode .descriptionInner').hide();
	$j('#content').removeClass();
	$j('.editing').find('.cancel').click();
	
	// possible options in the menu
	var options = ['Text', 'References', 'Images', 'Templates', 'FullEditor'];
	
	// check for all options if they are selected
	for (var optionNr in options) {
		if (options[optionNr]) {
			var option = options[optionNr];
			
			// if a certain option is selected, show the description
			// and set the edit mode in #content, then exit this function as only
			// one mode can be selected
			if($j('#edit' + option).attr('checked')) {
				$j('#description' + option).show();
				$j('#content').addClass('mode' + option);
				return;
			}
		}
	}
};

$j(document).ready(function() {
	// make all sentences clickable
	$j('.sentence').click(slClick);
	
	// make the edit mode radiobuttons clickable
	$j('.optionMode').change(slEditMode);
	
	// check the current selected edit mode
	slEditMode();
});