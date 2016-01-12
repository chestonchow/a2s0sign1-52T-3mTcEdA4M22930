//
// MCD4290 T3 2015 Assignment 2 Weather Tracking app
//
// Team: 23
//
// Written by Yin Chun Chow
//
// addlocation.js
//

//setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 2000;  //time in ms, 2 second for example
var placeLat, placeLon;
var locationObj;
var googleAPIKey = "AIzaSyB7L7uo2_XIymDjCLTpqApOQ6ZUciMVwy8";

var key = "locations";


//on keyup, start the countdown
function keyUp(){
	clearTimeout(typingTimer);
  	typingTimer = setTimeout(doneTyping, doneTypingInterval);
};

//on keydown, clear the countdown 
function keyDown() {
	clearTimeout(typingTimer);
};

//user is "finished typing," do something
function doneTyping () {
	var address = document.getElementById("location").value;
	var lowerCard = document.getElementById("img");
	var width = lowerCard.offsetWidth-10;
  	if (address){
		console.log(address);

		var oReq = new XMLHttpRequest();
		oReq.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key="+googleAPIKey);
		oReq.onload = function() {
  			var jsonObj = JSON.parse(this.responseText);

  			placeLat = jsonObj.results[0].geometry.location.lat;
        	placeLon = jsonObj.results[0].geometry.location.lng;

			while (lowerCard.firstChild) {
  				lowerCard.removeChild(lowerCard.firstChild);
			}
			var img = new Image();
    		img.src = "https://maps.googleapis.com/maps/api/staticmap?center="+placeLat+","+placeLon+"&zoom=15&size="+width+"x"+width+"&sensor=false&markers="+placeLat+","+placeLon;
			lowerCard.appendChild(img);
		}
		oReq.send();
	}
}

function addPlace(){
	var alias = document.getElementById("alias").value;
	var alert = document.getElementById("alert");
	if (alias && placeLat && placeLon){
		alert.innerHTML = "";
		if (typeof(Storage) !== "undefined"){
			if (localStorage.getItem(key)){
				locationObj = JSON.parse(localStorage.getItem(key));
			} else {
				locationObj = {
					locations:[]
				}
			}
			locationObj.locations.push({nickname:alias, lat:placeLat, lon:placeLon});
			alert.innerHTML = "Added";
			console.log(locationObj);
			if (JSON.stringify(locationObj.locations[locationObj.locations.length - 1]) === JSON.stringify(locationObj.locations[locationObj.locations.length - 2])){
				locationObj.locations.pop();
				alert.innerHTML = "It's already there!!";
			}
			localStorage.setItem(key, JSON.stringify(locationObj));
		} else {
			alert.innerHTML = "localStorage is not supported by current browser.";
		}
	} else {
		alert.innerHTML = "Please fill in all the fields!";
	}
				
	//now clear memory
	locationObj = {};
}
