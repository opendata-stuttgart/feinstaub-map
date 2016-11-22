<template lang="jade">
#content
	geo-map(@cell-selected!="(cell) => selectedCell = cell")
	cell-info(:cell='selectedCell')
</template>
<script>
import GeoMap from './map'
import CellInfo from './cell-info'

export default {
	components: {GeoMap, CellInfo},
	data () {
		return {
			selectedCell: null
		}
	},
}
</script>
<style lang="stylus">
</style>
