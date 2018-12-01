// This loads JS files in the head element
function loadJS(url){
	// adding the script tag to the head
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;

	// fire the loading
	head.appendChild(script);
}

enquire.register("screen and (max-width: 599px)", {
	match : function() {
	// Load a mobile JS file
	loadJS('src/mobile.js');
	}
});

enquire.register("screen and (min-width: 800px)", {
	match : function() {
	// Load a mobile JS file
	loadJS('src/desktop.js');
	}
});

enquire.register("screen and (min-width: 600px) and (max-width: 799px)", {
	match : function() {
	// Load a mobile JS file
	loadJS('src/tablet.js');
	}
});