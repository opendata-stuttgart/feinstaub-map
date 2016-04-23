const URL = 'http://10.42.26.109:8000/v1/now/'
import _ from 'lodash'

let api = {
	fetchNow() {
		return fetch(URL).then((response) => response.json())
	},

	getUniqueCells() {
		return api.fetchNow().then((json) => {
			let cells = _.chain(json)
				.filter((sensor) => sensor.location.latitude != null && sensor.location.longitude != null)
				.groupBy((sensor) => sensor.location.latitude + '|' + sensor.location.longitude)
				.map((values, key) => {
					let lat = Number(values[0].location.latitude)
					let long = Number(values[0].location.longitude)
					return {bounds: [[lat, long],[lat + 0.001, long + 0.001]]}
				})
				.value()
			console.log(cells)

			return Promise.resolve(cells)
		})
	}
}

export default api
