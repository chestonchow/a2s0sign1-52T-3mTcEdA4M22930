//
// MCD4290 T3 2015 Assignment 2 Weather Tracking app
//
// Team: 23
//
// Written by Yin Chun Chow
//
// weather.js
//

var key = "locations";
var list = "", deList = "";
var locationObj;
var forecastAPIKey = "fd068e14560e1cd0a1c501ddbc84f078";
var firstDay, secondDay, thirdDay, fourthDay;
var currLoc = {
	nickname:"Current Location",
	lat:0,
	lon:0
	};

document.getElementById("Alocation").innerHTML = "Current Location";

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function (position){
		currLoc.lat = position.coords.latitude;
		currLoc.lon = position.coords.longitude;
		showMap(currLoc);
		requestWeather(currLoc);}, null, {enableHighAccuracy: true});
} else {
	alert("Oops, no geolocation support");
}




if (typeof(Storage) !== "undefined"){
	if (localStorage.getItem(key)){
		locationObj = JSON.parse(localStorage.getItem(key));
	} else {
		locationObj = {
			locations:[]
		};
	}
	for (var i = 0; i < locationObj.locations.length; ++i) {
		list += '<a class="mdl-navigation__link" onClick="changeActiveLocation(&quot;'+ locationObj.locations[i].nickname +'&quot;)">'+ locationObj.locations[i].nickname +'</a>';
		deList += '<a class="mdl-navigation__link" onClick="deleteLocation(&quot;'+ locationObj.locations[i].nickname +'&quot;)">Delete '+ locationObj.locations[i].nickname +'</a>';
	}

	document.getElementById("list").innerHTML = list;
	document.getElementById("deList").innerHTML = deList;

} else {
	console.log("localStorage is not supported by current browser.");
}

function changeActiveLocation(name){
	var activeLocation;
	document.getElementById("Alocation").innerHTML = name;
	var firstCard = document.getElementById("img");
	var width = firstCard.offsetWidth-10;
	if (name === "Current Location"){
		activeLocation = currLoc;
	} else {
		for (var i = 0; i < locationObj.locations.length; ++i) {
			if (locationObj.locations[i].nickname === name){
				activeLocation = locationObj.locations[i];
				break;
			}
		}
	}

	showMap(activeLocation);
	requestWeather(activeLocation);
	//Close Drawer
	document.getElementsByClassName('mdl-layout__drawer')[0].classList.toggle("is-visible");
	document.getElementsByClassName('mdl-layout__obfuscator')[0].classList.toggle("is-visible");
}

function deleteLocation(name){
	if (typeof(Storage) !== "undefined"){
			if (localStorage.getItem(key)){
				locationObj = JSON.parse(localStorage.getItem(key));
				for (var i = 0; i < locationObj.locations.length; ++i) {
					if (locationObj.locations[i].nickname === name){
						locationObj.locations.splice(i, 1);
					}
				}
			}
			localStorage.setItem(key, JSON.stringify(locationObj));
		}

	//reload page
	document.location.reload(true);
}

function showMap(location){
	var firstCard = document.getElementById("img");
	var width = firstCard.offsetWidth-10;
	while (firstCard.firstChild) {
		firstCard.removeChild(firstCard.firstChild);
	}
	var img = new Image();
	img.src = "https://maps.googleapis.com/maps/api/staticmap?center="+location.lat+","+location.lon+"&zoom=15&size="+width+"x"+width+"&sensor=false&markers="+location.lat+","+location.lon;
	firstCard.appendChild(img);
}

function requestWeather(location){
	// Make request
	var script = document.createElement('script');
	script.src = "https://api.forecast.io/forecast/"+forecastAPIKey+"/"+location.lat+","+location.lon+"?units=ca&callback=printWeather";
	console.log(script.src);
	document.body.appendChild(script);
}

function printWeather(weather) {
	console.log(weather);
	var secondCard = document.getElementById("curr"), thirdCard = document.getElementById("fore");

	//Current Weather
	var currTemp = Math.round(weather.currently.temperature);
	var icon = weather.currently.icon;
	var txt = weather.currently.summary;
	var hum = weather.currently.humidity*100;
	var wind = Math.round(weather.currently.windSpeed);

	//Weather Forecast
	var row1 = "<thead><tr><th>Weather Forecast</th>",
	row2 = "<tbody><tr><td></td>",
	row3 = "<tr><td>Min Temp. (&ordm;C)</td>",
	row4 = "<tr><td>Max Temp. (&ordm;C)</td>";

	var weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	var nextHi7 = 0;

	for (var i = 1; i < 8; ++i)
	{
		var date = new Date();
		date.setTime((weather.daily.data[i].time+weather.offset*3600+date.getTimezoneOffset()*60)*1000);
		var num = date.getDay();
		var nameOfDay = weekday[num];
		var minTemp = Math.round(weather.daily.data[i].temperatureMin);
		var maxTemp = weather.daily.data[i].temperatureMax;
		nextHi7 += maxTemp;
		var icon = weather.daily.data[i].icon;

		row1 += "<th>" + nameOfDay + "</th>";
		row2 += "<td><img src='images/icons/"+icon+".png'></td>";
		row3 += "<td>" + minTemp + "</td>";
		row4 += "<td>" + Math.round(maxTemp) + "</td>";
	}

	nextHi7 = Math.round(nextHi7/7);
	secondCard.innerHTML = "<p><img src='images/icons/"+icon+".png' class='currIcon'>&nbsp;&nbsp;<span class='currTemp'>"+currTemp+"&ordm;C</span><br>"+txt+"</p><p><br>Humidity is "+hum+"%<br>Wind Speed is "+wind+"km/h<br>Average high temperature for next 7 days is "+nextHi7+"&ordm;C</p>";
	thirdCard.innerHTML=row1+"</tr></thead>"+row2+"</tr>"+row3+"</tr>"+row4+"</tr></tbody>";
}

