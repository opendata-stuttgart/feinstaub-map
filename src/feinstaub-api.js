const URL = 'https://api.luftdaten.info/v1/now/'
import _ from 'lodash'

let api = {
	fetchNow() {
		return fetch(URL).then((response) => response.json())
	},

	getUniqueCells() {
		return api.fetchNow().then((json) => {
			let cells = _.chain(json)
				.filter((sensor) => sensor.location.latitude != null && sensor.location.longitude != null && sensor.sensor.sensor_type.name == "PPD42NS" && sensor.sensordatavalues.length == 6)
				.groupBy((sensor) => sensor.location.latitude + '|' + sensor.location.longitude)
				.map((values, key) => {
					let data = _.reduce(values, (acc, value) => {
						let data = _.keyBy(value.sensordatavalues, 'value_type')
						acc.P1 += Number(data.P1.value)
						acc.P2 += Number(data.P2.value)
						return acc
					}, {P1: 0, P2: 0})
					let lat = Number(values[0].location.latitude)
					let long = Number(values[0].location.longitude)
					return {
						bounds: [[lat, long],[lat + 0.001, long + 0.001]],
						latitude: lat+0.0005,
						longitude: long+0.0005,
						data: {
							P1: data.P1 / values.length,
							P2: data.P2 / values.length
						}
					}
				})
				.value()
			console.log(cells)

			return Promise.resolve(cells)
		})
	}
}

export default api
