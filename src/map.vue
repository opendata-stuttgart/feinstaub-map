<template lang="jade">
.map
</template>
<script>
import leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'
import config from 'config'
import api from './feinstaub-api'
import './hexbin-layer'

export default {
	mounted () {
		this.$nextTick(() => {
			let map = leaflet.map(this.$el, {
				center: config.center,
				zoom: config.zoom
			})
			leaflet.tileLayer('https://{s}.tiles.madavi.de/{z}/{x}/{y}.png', {
				attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
				maxZoom: 13,
				// continuousWorld: false,
				// noWrap: true

			}).addTo(map)

			let options = {
				mouseover: (data) => {
					this.$emit('cell-selected', data)
					document.getElementById("cell-info").style.display = ""
				},
				mouseout: () => {
				},
				click: (data) => {
					this.$emit('cell-selected', data)
					document.getElementById("cell-info").style.display = ""
				}
			}

			let hexLayer = new leaflet.HexbinLayer(options).addTo(map)

			api.getAllSensors().then((cells) => {
				hexLayer.data(cells)
			})
		})
	}
}
</script>
<style lang="stylus">
</style>
