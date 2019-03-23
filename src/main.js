import Vue from 'vue'
import querystring from 'querystring'
import Main from './main.vue'
import './style.styl'
import config from 'config'
import places from './places'
import zooms from './zooms' 

// parse url parameters

const query = querystring.parse(window.location.search.substring(1))

console.log("Query"+query);

window.onpopstate = function(event) {
	if ((typeof location.search !== 'undefined') && (typeof location.hash !== 'undefined') && (location.hash !== '')) {
		if (typeof location.pathname !== 'undefined') {
			var path = location.pathname;
			path = path.substring(0, path.lastIndexOf('/') + 1);
		} else {
			var path = "/";
		}

		var new_location = location.protocol+'//'+location.host+path;
		if (typeof location.hash !== 'undefined') {
			new_location += location.hash;
		}
		console.log("New location: "+new_location);
//		location.replace(new_location);
		history.pushState('remove_query', null, new_location);
	}
};

console.log("Query No overlay: "+query.nooverlay);
if (typeof query.nooverlay !== "undefined") {
	config.nooverlay = true;
} else {
	document.getElementById("betterplace").style.display = "block";
}

if (query.center) {
	const center = query.center.split(',').map((coord) => parseFloat(coord))
	config.center = center
} else if (location.hash) {
		var hash_params = location.hash.split("/");
		config.center = [hash_params[1],hash_params[2]];
		config.zoom = hash_params[0].substring(1);
} else {
	var hostname = location.hostname;
	var hostname_parts = hostname.split(".");
	if (hostname_parts.length == 4) {
		var place = hostname_parts[0].toLowerCase();
		if (typeof places[place] !== 'undefined' && places[place] !== null) {
			config.center = places[place];
			config.zoom = 11;
		}
		if (typeof zooms[place] !== 'undefined' && zooms[place] !== null) {
			config.zoom = zooms[place];
		}
	}
	console.log("Center: "+config.center);
	console.log("Zoom: "+config.zoom)
}
if (query.zoom) {
	config.zoom = parseInt(query.zoom)
}  
/* eslint-disable no-new */

new Vue(Main).$mount('#v-app')
