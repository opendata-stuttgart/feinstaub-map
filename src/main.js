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
	var places = {
//	Germany
	"deutschland": [51.165,10.455277777778],
	"stuttgart": [48.800000,9.200000],
	"aachen": [50.776666666667,6.0836111111111],
	"augsburg": [48.3585423,10.8943915],
	"berlin": [52.516666666,13.383333333],
	"bielefeld": [52.016666666,8.516666666],
	"bochum": [51.4825,7.2169444444444],
	"boeblingen": [48.6851035,9.0090113],
	"bonn": [50.733991666667,7.0998138888889],
	"braunschweig": [52.269166666667,10.521111111111],
	"bremen": [53.076944444,8.808888888],
	"chemnitz": [50.832222222222,12.924166666667],
	"darmstadt": [49.866666666667,8.65],
	"dortmund": [51.514166666667,7.4638888888889],
	"dresden": [51.0517214,13.7310367],
	"duesseldorf": [51.225555555556,6.7827777777778],
	"duisburg": [51.435147222222,6.7626916666667],
	"erfurt": [50.978055555556,11.029166666667],
	"essen": [51.458069444444,7.0147611111111],
	"frankfurt": [50.110555555556,8.6822222222222],
	"freiburg": [47.990000,7.820000],
	"fuerth": [49.478333333333,10.990277777778],
	"gelsenkirchen": [51.511111111111,7.1005555555556],
	"gera": [50.8758368,12.086176],
	"greiz": [50.6535563,12.1884156],
	"hagen": [51.359444444444,7.475],
	"halle": [51.482777777778,11.97],
	"hamburg": [53.5464148,9.984099],
	"hamm": [51.681069444444,7.8171166666667],
	"hannover": [52.374444444444,9.7386111111111],
	"heidelberg": [49.412222222222,8.71],
	"heilbronn": [49.141666666667,9.2222222222222],
	"herne": [51.541944444444,7.2238888888889],
	"ingolstadt": [48.765555555556,11.424444444444],
	"jena": [50.9237905,11.5806506],
	"karlsruhe": [49.014,8.4043],
	"kassel": [51.316666666667,9.5],
	"kiel": [54.325277777778,10.140555555556],
	"koeln": [50.938055555556,6.9569444444444],
	"konstanz": [47.660000,9.160000],
	"krefeld": [51.336944444444,6.5641666666667],
	"leipzig": [51.340333333333,12.37475],
	"leverkusen": [51.033333333333,6.9833333333333],
	"ludwigshafen": [49.483055555556,8.4477777777778],
	"luebeck": [53.866111111111,10.683888888889],
	"magdeburg": [52.133333333333,11.616666666667],
	"mainz": [50,8.2711111111111],
	"mannheim": [49.483611111111,8.4630555555556],
	"moenchengladbach": [51.191111111111,6.4419444444444],
	"muelheim-an-der-ruhr": [51.433055555556,6.8830555555556],
	"muenchen": [48.140000,11.560000],
	"muenster": [51.9502139,7.591131],
	"neuss": [51.198611111111,6.6913888888889],
	"nuernberg": [49.455555555556,11.078611111111],
	"oberhausen": [51.470277777778,6.8522222222222],
	"oldenburg": [53.143888888,8.213888888],
	"osnabrueck": [52.278888888889,8.0430555555556],
	"paderborn": [51.7231179,8.7548663],
	"potsdam": [52.395833333333,13.061388888889],
	"regensburg": [49.016666666,12.083333333],
	"reutlingen": [48.4912203,9.208576],
	"rostock": [54.083333333333,12.133333333333],
	"saarbruecken": [49.233333333333,7],
	"solingen": [51.171388888889,7.0833333333333],
	"tuebingen": [48.5197257,8.998209],
	"ulm": [48.3843119,10.000000],
	"wiesbaden": [50.082083333333,8.2413611111111],
	"wismar": [53.888213888889,11.462016666667],
	"wolfsburg": [52.423055555556,10.787222222222],
	"wuerzburg": [49.794444444444,9.9294444444444],
	"wuppertal": [51.259166666667,7.2111111111111],

//	Schweiz
	"schweiz": [46.8,8.2333333333333],
	"basel": [47.55814,7.58769],
	"zuerich": [47.37174,8.54226],

//	Poland
	"poland": [52.146944444444,19.378055555556],
	"wroclaw": [51.11,17.032222222222],

//	Hungary
	"hungary": [47,20],
	"szeged": [46.255,20.145],

//  country level maps
	"taiwan": [23.62985,121.05317]
	
	}

	var zooms = {
		"deutschland": 6,
		"schweiz": 8,
		"poland": 6,
		"hungary": 7,
		"taiwan": 8
	};


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
