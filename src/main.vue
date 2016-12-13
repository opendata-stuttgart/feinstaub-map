<template lang="jade">
#content
	geo-map(@cell-selected!="(cell) => selectedCell = cell")
	map-legend
	cell-info(:cell='selectedCell')
</template>
<script>
import GeoMap from './map'
import CellInfo from './cell-info'
import MapLegend from './legend'

export default {
	components: {GeoMap, CellInfo, MapLegend},
	data () {
		return {
			selectedCell: null
		}
	},
}
</script>
<style lang="stylus">
</style>
