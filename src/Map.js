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
			maxZoom: 13,
			id: config.mapbox.id,
			accessToken: config.mapbox.accessToken,
			// continuousWorld: false,
			// noWrap: true

		}).addTo(map)

		let options = {
			mouseover: (data) => {
				this.$dispatch('cell-selected', data)
			},
			mouseout: () => {
				// this.$dispatch('cell-selected', null)
			},
			colorRange: ['green', 'red']
		}

		let hexLayer = new leaflet.HexbinLayer(options).addTo(map)

		api.getAllSensors().then( (cells) => {
			hexLayer.data(cells)
		})
	}
}
