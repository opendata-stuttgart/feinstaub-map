const URL = 'https://api.luftdaten.info/static/v2/data.dust.min.json'
// const URL = 'https://api.luftdaten.info/v1/filter/area=48.800000,9.200000,50'

import _ from 'lodash'
import 'whatwg-fetch'

let api = {
	fetchNow() {
		return fetch(URL).then((response) => response.json())
	},

	// fetches from /now, ignores non-finedust sensors
	// /now returns data from last 5 minutes, so we group all data by sensorId
	// and compute a mean to get distinct values per sensor
	getAllSensors() {
		return api.fetchNow().then((json) => {
			let cells = _.chain(json)
				.filter((sensor) =>
					sensor.location.latitude != null &&
					sensor.location.longitude != null && (
					// (sensor.sensor.sensor_type.name == "PPD42NS" && sensor.sensordatavalues.length >= 6) ||
					(sensor.sensor.sensor_type.name == "PMS3003" && sensor.sensordatavalues.length >= 2) ||
					(sensor.sensor.sensor_type.name == "PMS5003" && sensor.sensordatavalues.length >= 2) ||
					(sensor.sensor.sensor_type.name == "PMS7003" && sensor.sensordatavalues.length >= 2) ||
					(sensor.sensor.sensor_type.name == 'SDS011' && sensor.sensordatavalues.length >= 2))
				)
				.groupBy((sensor) => sensor.sensor.id)
				.map((values, key) => {
					let lat = Number(values[0].location.latitude)
					let long = Number(values[0].location.longitude)
					let data = _.reduce(values, (acc, value) => {
						let d = _.keyBy(value.sensordatavalues, 'value_type')
						if (typeof d.P1 !== 'undefined' && d.P1 !== null && typeof d.P2 !== 'undefined' && d.P2 !== null) {
							acc.P1 += Number(d.P1.value)
							acc.P2 += Number(d.P2.value)
						}
						return acc
					}, {P1: 0, P2: 0})
					return {
						latitude: lat,
						longitude: long,
						id: values[0].sensor.id,
						data: {
							P1: data.P1 / values.length,
							P2: data.P2 / values.length
						}
					}
				})
				.value()

			return Promise.resolve(cells)
		})
	}
}

export default api
