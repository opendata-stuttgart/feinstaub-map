import Vue from 'vue'
import querystring from 'querystring'
import Main from './main.vue'
import './style.styl'
import config from 'config'

// parse url parameters

const query = querystring.parse(window.location.search.substring(1))

console.log(query)

if (query.center) {
	const center = query.center.split(',').map((coord) => parseFloat(coord))
	config.center = center
} else {
	var towns = new Array();
	var zooms = new Array();

//	towns[""] = [];	
//	Germany
	towns["deutschland"] = [51.165,10.455277777778]; zooms["deutschland"] = 6;
	towns["stuttgart"] = [48.800000,9.200000];
	towns["augsburg"] = [48.3585423,10.8943915];
	towns["berlin"] = [52.516666666,13.383333333];
	towns["bielefeld"] = [52.016666666,8.516666666];
	towns["bochum"] = [51.4825,7.2169444444444];	
	towns["bonn"] = [50.733991666667,7.0998138888889];	
	towns["bremen"] = [53.076944444,8.808888888];
	towns["dortmund"] = [51.514166666667,7.4638888888889];	
	towns["dresden"] = [51.0517214,13.7310367];
	towns["duesseldorf"] = [51.225555555556,6.7827777777778];	
	towns["duisburg"] = [51.435147222222,6.7626916666667];	
	towns["essen"] = [51.458069444444,7.0147611111111];	
	towns["gera"] = [50.8758368,12.086176];
	towns["greiz"] = [50.6535563,12.1884156];
	towns["frankfurt"] = [50.110555555556,8.6822222222222];	
	towns["freiburg"] = [47.990000,7.820000];
	towns["hamburg"] = [53.5464148,9.984099];
	towns["hannover"] = [52.374444444444,9.7386111111111];
	towns["heilbronn"] = [49.141666666667,9.2222222222222];
	towns["jena"] = [50.9237905,11.5806506];
	towns["karlsruhe"] = [49.014,8.4043];
	towns["koeln"] = [50.938055555556,6.9569444444444];	
	towns["konstanz"] = [47.660000,9.160000];
	towns["leipzig"] = [51.340333333333,12.37475];	
	towns["muenchen"] = [48.140000,11.560000];
	towns["muenster"] = [51.9502139,7.591131];
	towns["nuernberg"] = [49.455555555556,11.078611111111];
	towns["oldenburg"] = [53.143888888,8.213888888];
	towns["paderborn"] = [51.7231179,8.7548663];
	towns["regensburg"] = [49.016666666,12.083333333];
	towns["rostock"] = [54.083333333333,12.133333333333];
	towns["ulm"] = [48.3843119,10.000000];
	towns["wismar"] = [53.888213888889,11.462016666667];
	towns["wuppertal"] = [51.259166666667,7.2111111111111];	

//	Schweiz
	towns["schweiz"] = [46.8,8.2333333333333]; zooms["schweiz"] = 8;
	towns["basel"] = [47.55814,7.58769];
	towns["zuerich"] = [47.37174,8.54226];

//	Poland
	towns["poland"] = [52.146944444444,19.378055555556]; zooms["poland"] = 6;
	towns["wroclaw"] = [51.11,17.032222222222];

//  country level maps
	towns["taiwan"] = [23.62985,121.05317]; zooms["taiwan"] = 8;

	var hostname = location.hostname;
	var hostname_parts = hostname.split(".");
	var town = hostname_parts[0].toLowerCase();
	if (typeof towns[town] !== 'undefined' && towns[town] !== null) {
		config.center = towns[town];
	}
	if (typeof zooms[town] !== 'undefined' && zooms[town] !== null) {
		config.zoom = zooms[town];
	}
	console.log("Center: "+config.center);
	console.log("Zoom: "+config.zoom)
}

/* eslint-disable no-new */

new Vue(Main).$mount('#v-app')
