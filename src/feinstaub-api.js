const URL = 'https://api.luftdaten.info/static/v2/data.dust.min.json'
// const URL = 'https://api.luftdaten.info/v1/filter/area=48.800000,9.200000,50'

import _ from 'lodash'
import 'whatwg-fetch'

const AQI=[50,100,150,200,300,400,500,1000];
const AQI_PM10=[54,154,254,354,424,504,604,99999];
const AQI_PM25=[12,35.4,55.4,150.4,250.4,350.4,500.4,99999.9];

function rescaleValue(value, scale) {
	var v0 = 0;
	var s0 = 0;
	for (var i in scale) {
		var v1 = scale[i]
		var s1 = AQI[i]
		var delta_v = v1 - v0
		var delta_s = s1 - s0
		if (v0 <= value <= v1) {
		  var de_v = delta_s / delta_v
		  return  s0 + ( (value - v0) * de_v )}
		s0 = s1
		v0 = v1}
	return s0 + ( (value - v0) * de_v ) 
}

function getAQI(pm10, pm25) {
	var r = Math.max(rescaleValue(pm10, AQI_PM10), rescaleValue(pm25, AQI_PM25));
	return r
}

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
					(sensor.sensor.sensor_type.name == "HPM" && sensor.sensordatavalues.length >= 2) ||
					(sensor.sensor.sensor_type.name == "PMS1003" && sensor.sensordatavalues.length >= 2) ||
					(sensor.sensor.sensor_type.name == "PMS3003" && sensor.sensordatavalues.length >= 2) ||
					(sensor.sensor.sensor_type.name == "PMS5003" && sensor.sensordatavalues.length >= 2) ||
					(sensor.sensor.sensor_type.name == "PMS6003" && sensor.sensordatavalues.length >= 2) ||
					(sensor.sensor.sensor_type.name == "PMS7003" && sensor.sensordatavalues.length >= 2) ||
					(sensor.sensor.sensor_type.name == "SDS021" && sensor.sensordatavalues.length >= 2) ||
					(sensor.sensor.sensor_type.name == 'SDS011' && sensor.sensordatavalues.length >= 2))
				)
				.groupBy((sensor) => sensor.sensor.id)
				.map((values, key) => {
					let lat = Number(values[0].location.latitude)
					let long = Number(values[0].location.longitude)
					let data = _.reduce(values, (acc, value) => {
						let d = _.keyBy(value.sensordatavalues, 'value_type')
						if (typeof d.P1 !== 'undefined' && d.P1 !== null && typeof d.P2 !== 'undefined' && d.P2 !== null && Number(d.P1.value) < 1999 && Number(d.P2.value < 999) ) {
							acc.P1 += Number(d.P1.value)
							acc.P2 += Number(d.P2.value)
						}
						return acc
					}, {P1: 0, P2: 0})
					var P1 = data.P1 / values.length;
					var P2 = data.P2 / values.length
					return {
						latitude: lat,
						longitude: long,
						id: values[0].sensor.id,
						data: {
							P1: P1,
							P2: P2,
							AQI: getAQI(P1, P2)
						}
					}
				})
				.value()

			return Promise.resolve(cells)
		})
	}
}

export default api
