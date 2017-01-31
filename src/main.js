import Vue from 'vue'
import querystring from 'querystring'
import Main from './main.vue'
import './style.styl'
import config from 'config'

// parse url parameters

const query = querystring.parse(window.location.search.substring(1))

console.log(query)

if (query.center) {
	const center = query.center.split(',').map((coord) => parseFloat(coord))
	config.center = center
}
/* eslint-disable no-new */

new Vue(Main).$mount('#v-app')
