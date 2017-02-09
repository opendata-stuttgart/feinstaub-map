import Vue from 'vue'
import querystring from 'querystring'
import Main from './main.vue'
import './style.styl'
import config from 'config'
import places from './places'
import zooms from './zooms' 

// parse url parameters

const query = querystring.parse(window.location.search.substring(1))

console.log(query)

if (query.center) {
	const center = query.center.split(',').map((coord) => parseFloat(coord))
	config.center = center
} else {
	var hostname = location.hostname;
	var hostname_parts = hostname.split(".");
	var place = hostname_parts[0].toLowerCase();
	if (typeof places[place] !== 'undefined' && places[place] !== null) {
		config.center = places[place];
	}
	if (typeof zooms[place] !== 'undefined' && zooms[place] !== null) {
		config.zoom = zooms[place];
	}
	console.log("Center: "+config.center);
	console.log("Zoom: "+config.zoom)
}

/* eslint-disable no-new */

new Vue(Main).$mount('#v-app')
