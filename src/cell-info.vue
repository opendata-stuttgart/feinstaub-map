<template lang="jade">
#cell-info(v-if="cell")
	h3 #Sensors {{cell.length}}
	
	table
	#Grenzwert: 50µgr/Kubikmeter
		tr
			th
			th PM10
			th PM2.5
		tr.mean
			td mean
			td {{mean.P1.toFixed(2)}}
			td {{mean.P2.toFixed(2)}}
		tr(v-for="sensor in cell")
			td {{sensor.o.id}}
			td {{sensor.o.data.P1.toFixed(2)}}
			td {{sensor.o.data.P2.toFixed(2)}}
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
