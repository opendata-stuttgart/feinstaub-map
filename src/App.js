import Map from './Map'
import CellInfo from './CellInfo'

export default {
	template: require('./app.jade'),
	components: {map: Map, 'cell-info': CellInfo},
	data() {
		return {
			selectedCell: null
		}
	},
	methods: {

	},
	ready() {

	},
	events: {
		'cell-selected'(data) {
			this.selectedCell = data
		}
	}
}
