<template lang="jade">
#cell-info(v-if="cell")
	a(href='#' onclick='document.getElementById("cell-info").style.display="none";return false;' style='color:white') (close)

	h3 #Sensors {{cell.length}}
	
	table
		tr
			th µg/m³
			th PM10
			th PM2.5
		tr.mean
			td mean
			td {{mean.P1.toFixed(0)}}
			td {{mean.P2.toFixed(0)}}
		tr(v-for="sensor in cell")
			td {{sensor.o.id}}
			td {{sensor.o.data.P1.toFixed(0)}}
			td {{sensor.o.data.P2.toFixed(0)}}
</template>
<script>
import _ from 'lodash'

export default {
	data () {
		return {
		}
	},
	props: {
		'cell': Array
	},
	computed: {
		mean () {
			return {
				P1: _.meanBy(this.cell, (o) => o.o.data.P1),
				P2: _.meanBy(this.cell, (o) => o.o.data.P2)
			}
		}
	}
}
</script>
<style lang="stylus">
</style>
