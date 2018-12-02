var initialPlaces = [
	{title: 'Central Park', location: {lat: 40.771133, lng: -73.974187}},
	{title: 'Solomon R.Guggenheim Museum', location: {lat: 40.782980, lng: -73.958971}},
	{title: 'Empire State Building', location: {lat: 40.748441, lng: -73.985664}},
	{title: 'Park Avenue Armory', location: {lat: 40.767495, lng: -73.966100}},
	{title: 'Washington Square Park', location: {lat: 40.730823, lng: -73.997332}},
	{title: 'Whitney Museum of American Art', location: {lat: 40.739588, lng: -74.008863}}
];

// Create a new blank array for all the listing markers.
var markers = [];

// Create some variables to use across the site
var map;
var largeInfowindow;
var highlightedIcon;
var defaultIcon;

// Initialize the map and create the markers
var initMap = function() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.7413549, lng: -73.9980244},
		zoom: 13,
		mapTypeControl: false
	});

	largeInfowindow = new google.maps.InfoWindow();

	// Two marker icons to be used
	highlightedIcon = makeMarkerIcon('FFFF24');
	defaultIcon = makeMarkerIcon('0091ff');

	// The following group uses the location array to create an array of markers on initialize.
	for (var i = 0; i < initialPlaces.length; i++) {
		// Get the position from the location array.
		var position = initialPlaces[i].location;
		var title = initialPlaces[i].title;
		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i
		});
		// Push the marker to our array of markers.
		markers.push(marker);
		// Create an onclick event to open an infowindow at each marker.
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
			setAllMarkersToDefault();
			this.setIcon(highlightedIcon);
		});
	};

	setAllMarkersToDefault();
	// Display all markers on the map
	showListings();
}

function maperrorhandler(){
	alert('error loading map');
}

// Create marker icons based on the color provided
function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
		'|40|_|%E2%80%A2',
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34),
		new google.maps.Size(21,34));
	return markerImage;
}

// Set all markers to default icon
function setAllMarkersToDefault(){
	for (var i = 0; i < markers.length; i++) {
		markers[i].setIcon(defaultIcon);
	}
}

function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		infowindow.marker = marker;

		// Create a link to connect to wikipedia api
		var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';

		// Send ajax request to wikipedia and retrieve the name in response
		$.ajax({
			url: wikiUrl,
			dataType: "jsonp",
			success: function(response){
				var name = response[2][0];
				if(name){
					infowindow.setContent('<div style="max-width:250px;"><div>&nbsp &nbsp Data provided from wikipedia:</div>'+'<div>&nbsp ' + name + '</div></div>');
					infowindow.open(map, marker);
				}else {
					infowindow.setContent('<div>&nbsp &nbsp Error: cannot read Data from wikipedia!</div>');
					infowindow.open(map, marker);
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				if (jqXHR.status == 500) {
					alert('Internal error: ' + jqXHR.responseText);
				} else {
					alert('Unexpected error. Cannot load data from wikipedia');
				}
			}
		});
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
		});
	}
}

var Place = function(data){
	this.name = ko.observable(data.title);
	this.location = ko.observable(data.location);
};
		
// This function will loop through the markers array and display them all.
function showListings() {
	var bounds = new google.maps.LatLngBounds();
	// Extend the boundaries of the map for each marker and display the marker
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
		bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
}
		  
var modelView = function() {
	var self = this;
	this.query = ko.observable('');

	// When a location on the list is clicked display it on the map
	this.sendAlert = function(place){
		var location = place.title;
		// Set all markers to default icon
		setAllMarkersToDefault();
		// Loop through the list of markers and find which one belongs to the clicked item
		for (var i = 0; i < markers.length; i++) {
			if(markers[i].title.toLowerCase().indexOf(location.toLowerCase()) >= 0){
				// Display location info in info window
				populateInfoWindow(markers[i], largeInfowindow);
				// Change the color of the choosen marker
				markers[i].setIcon(highlightedIcon);
				// Close the side nav to display the marker, this is effective in mobile view only
				closeNav();
			}
		}
	};

	// This binding is used for filtering
	this.placeList = ko.computed(function() {
		// Get the string entered in the search box
		var search = this.query().toLowerCase();
		// Remove all markers from the map
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		};
		
		// Find the items that contains the search query
		return ko.utils.arrayFilter(initialPlaces, function(place) {
			if(place.title.toLowerCase().indexOf(search) >= 0){
				var location = place.title;
				for (var i = 0; i < markers.length; i++) {
					// If a marker applies to the search, display it on the map
					if(markers[i].title.toLowerCase().indexOf(location.toLowerCase()) >= 0){
						markers[i].setMap(map);
					}
				}
				return true;
			} else {
				return false;
			}
		});
	},this);
};
ko.applyBindings(new modelView());
