<template lang="jade">
.map
</template>
<script>
import leaflet from 'leaflet'
import hash from 'leaflet-hash'
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
			leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
				maxZoom: 13,
				// continuousWorld: false,
				// noWrap: true

			}).addTo(map)

			let options = {
				mouseover: () => {
				},
				mouseout: () => {
				},
				click: (data) => {
					this.$emit('cell-selected', data)
					document.getElementById("cell-info").style.display = ""
					let row_counter = document.getElementsByClassName("cell_info_images");
					for (var i = 0; i < row_counter.length; i++) {
						row_counter[i].style.display = 'none'
					}
					row_counter = document.getElementsByClassName("graph_on");
					for (var i = 0; i < row_counter.length; i++) {
						row_counter[i].style.display = ''
					}
					row_counter = document.getElementsByClassName("graph_off");
					for (var i = 0; i < row_counter.length; i++) {
						row_counter[i].style.display = 'none'
					}
				}
			}

			let hexLayer = new leaflet.HexbinLayer(options).addTo(map)

			api.getAllSensors().then((cells) => {
				hexLayer.data(cells)
			})

			var hash = new L.hash(map);

		})
	}
}
</script>
<style lang="stylus">
</style>
