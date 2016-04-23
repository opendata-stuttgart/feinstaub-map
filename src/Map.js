import leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'
import config from '../config'
import api from './feinstaub-api'
import './hexbin-layer'

export default {
	template: require('./map.jade'),
	components: {},
	data() {
		return {
		}
	},
	methods: {

	},
	ready() {
		let map = leaflet.map(this.$el, {
			center: config.center,
			zoom: 13
		})
		leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
			maxZoom: 18,
			id: config.mapbox.id,
			accessToken: config.mapbox.accessToken
		}).addTo(map)

		let options = {
			radius: 10,
			opacity: 0.5,
			duration: 500,
			lng: function(d){
				return d.longitude
			},
			lat: function(d){
				return d.latitude
			},
			value: function(d){
				console.log(d)
				return d[0].o.data.P1
			},
			valueFloor: 0,
			valueCeil: undefined
		}

		let hexLayer = new leaflet.HexbinLayer(options).addTo(map)
		hexLayer.colorScale().range(['green', 'red']);

		api.getUniqueCells().then( (cells) => {
			hexLayer.data(cells)
			// for(let cell of cells) {
			// 	leaflet.rectangle( cell.bounds, {
			// 		color: 'red',
			// 		fillColor: '#f03',
			// 		fillOpacity: 0.5,
			// 		weight: 1
			// 	}).addTo(map)
			// }
		})
	}
}
