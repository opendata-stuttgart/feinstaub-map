import _ from 'lodash'

export default {
	template: require('./cell-info.jade'),
	components: {},
	data() {
		return {
		}
	},
	props: [
		'cell'
	],
	computed: {
		mean() {
			return {
				P1: _.meanBy(this.cell, (o) => o.o.data.P1),
				P2: _.meanBy(this.cell, (o) => o.o.data.P2)
			}
		}
	},
	methods: {

	},
	ready() {

	}
}
