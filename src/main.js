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
	var places = new Array();
	var zooms = new Array();

//	places[""] = [];	
//	Germany
	places["deutschland"] = [51.165,10.455277777778]; zooms["deutschland"] = 6;
	places["stuttgart"] = [48.800000,9.200000];
	places["aachen"] = [50.776666666667,6.0836111111111];
	places["augsburg"] = [48.3585423,10.8943915];
	places["berlin"] = [52.516666666,13.383333333];
	places["bielefeld"] = [52.016666666,8.516666666];
	places["bochum"] = [51.4825,7.2169444444444];	
	places["boeblingen"] = [48.6851035,9.0090113];
	places["bonn"] = [50.733991666667,7.0998138888889];	
	places["braunschweig"] = [52.269166666667,10.521111111111];
	places["bremen"] = [53.076944444,8.808888888];
	places["chemnitz"] = [50.832222222222,12.924166666667];
	places["dortmund"] = [51.514166666667,7.4638888888889];	
	places["dresden"] = [51.0517214,13.7310367];
	places["duesseldorf"] = [51.225555555556,6.7827777777778];	
	places["duisburg"] = [51.435147222222,6.7626916666667];	
	places["erfurt"] = [50.978055555556,11.029166666667];
	places["essen"] = [51.458069444444,7.0147611111111];	
	places["frankfurt"] = [50.110555555556,8.6822222222222];	
	places["freiburg"] = [47.990000,7.820000];
	places["gelsenkirchen"] = [51.511111111111,7.1005555555556];
	places["gera"] = [50.8758368,12.086176];
	places["greiz"] = [50.6535563,12.1884156];
	places["halle"] = [51.482777777778,11.97];
	places["hamburg"] = [53.5464148,9.984099];
	places["hannover"] = [52.374444444444,9.7386111111111];
	places["heilbronn"] = [49.141666666667,9.2222222222222];
	places["jena"] = [50.9237905,11.5806506];
	places["karlsruhe"] = [49.014,8.4043];
	places["kassel"] = [51.316666666667,9.5];	
	places["kiel"] = [54.325277777778,10.140555555556];
	places["koeln"] = [50.938055555556,6.9569444444444];	
	places["konstanz"] = [47.660000,9.160000];
	places["krefeld"] = [51.336944444444,6.5641666666667];
	places["leipzig"] = [51.340333333333,12.37475];	
	places["luebeck"] = [53.866111111111,10.683888888889];
	places["magdeburg"] = [52.133333333333,11.616666666667];
	places["mainz"] = [50,8.2711111111111];
	places["mannheim"] = [49.483611111111,8.4630555555556];
	places["moenchengladbach"] = [51.191111111111,6.4419444444444];
	places["muenchen"] = [48.140000,11.560000];
	places["muenster"] = [51.9502139,7.591131];
	places["nuernberg"] = [49.455555555556,11.078611111111];
	places["oberhausen"] = [51.470277777778,6.8522222222222];
	places["oldenburg"] = [53.143888888,8.213888888];
	places["paderborn"] = [51.7231179,8.7548663];
	places["regensburg"] = [49.016666666,12.083333333];
	places["reutlingen"] = [48.4912203,9.208576];	
	places["rostock"] = [54.083333333333,12.133333333333];
	places["tuebingen"] = [48.5197257,8.998209];	
	places["ulm"] = [48.3843119,10.000000];
	places["wiesbaden"] = [50.082083333333,8.2413611111111];
	places["wismar"] = [53.888213888889,11.462016666667];
	places["wuppertal"] = [51.259166666667,7.2111111111111];
 
//	Schweiz
	places["schweiz"] = [46.8,8.2333333333333]; zooms["schweiz"] = 8;
	places["basel"] = [47.55814,7.58769];
	places["zuerich"] = [47.37174,8.54226];

//	Poland
	places["poland"] = [52.146944444444,19.378055555556]; zooms["poland"] = 6;
	places["wroclaw"] = [51.11,17.032222222222];

//  country level maps
	places["taiwan"] = [23.62985,121.05317]; zooms["taiwan"] = 8;

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
