// https://github.com/Asymmetrik/leaflet-d3/blob/master/src/js/hexbin/HexbinLayer.js
import L from 'leaflet'
import d3 from 'd3'
import d3Hexbin from 'd3-hexbin'
import _ from 'lodash'

d3.hexbin = d3Hexbin.hexbin

L.HexbinLayer = L.Layer.extend({
	_undef(a) { return typeof a == "undefined" },
	options : {
		radius : 25,
		opacity: 0.5,
		duration: 200,
		valueFloor: 0,
		valueCeil: undefined,
		colorRange: ['#FF0000', '#08306b'],

		onmouseover: undefined,
		onmouseout: undefined,
		click: undefined,
		lng: function(d){
			return d.longitude
		},
		lat: function(d){
			return d.latitude
		},
		value: function(d){
			return _.meanBy(d, (o) => o.o.data.P1)
		}
	},

	initialize(options) {
		L.setOptions(this, options)

		this._data = [];
		this._colorScale = d3.scale.linear()
			.range(this.options.colorRange)
			.clamp(true)

	},

	onAdd(map) {
		this.map = map
		let _layer = this

		// SVG element
		this._svg = L.svg()
		map.addLayer(this._svg)
		this._rootGroup = d3.select(this._svg._rootGroup).classed("d3-overlay", true)
		this.selection = this._rootGroup

		// Init shift/scale invariance helper values
		this._pixelOrigin = map.getPixelOrigin()
		this._wgsOrigin = L.latLng([0, 0])
		this._wgsInitialShift = this.map.latLngToLayerPoint(this._wgsOrigin)
		this._zoom = this.map.getZoom()
		this._shift = L.point(0, 0)
		this._scale = 1

		// Create projection object
		this.projection = {
				latLngToLayerPoint: function (latLng, zoom) {
						zoom = _layer._undef(zoom) ? _layer._zoom : zoom
						let projectedPoint = _layer.map.project(L.latLng(latLng), zoom)._round()
						return projectedPoint._subtract(_layer._pixelOrigin)
				},
				layerPointToLatLng: function (point, zoom) {
						zoom = _layer._undef(zoom) ? _layer._zoom : zoom
						let projectedPoint = L.point(point).add(_layer._pixelOrigin)
						return _layer.map.unproject(projectedPoint, zoom)
				},
				unitsPerMeter: 256 * Math.pow(2, _layer._zoom) / 40075017,
				map: _layer.map,
				layer: _layer,
				scale: 1
		}
		this.projection._projectPoint = function(x, y) {
				let point = _layer.projection.latLngToLayerPoint(new L.LatLng(y, x))
				this.stream.point(point.x, point.y)
		}

		this.projection.pathFromGeojson =
				d3.geo.path().projection(d3.geo.transform({point: this.projection._projectPoint}))

		// Compatibility with v.1
		this.projection.latLngToLayerFloatPoint = this.projection.latLngToLayerPoint
		this.projection.getZoom = this.map.getZoom.bind(this.map)
		this.projection.getBounds = this.map.getBounds.bind(this.map)
		this.selection = this._rootGroup // ???

		// Initial draw
		this.draw()
	},

	onRemove(map) {
		if(this._container != null)
			this._container.remove()

		// Remove events
		map.off({'moveend': this._redraw}, this)

		this._container = null
		this._map = null

		// Explicitly will leave the data array alone in case the layer will be shown again
		//this._data = [];
	},

	addTo(map) {
		map.addLayer(this)
		return this
	},

	_disableLeafletRounding(){
		this._leaflet_round = L.Point.prototype._round
		L.Point.prototype._round = function(){ return this; }
	},

	_enableLeafletRounding(){
		L.Point.prototype._round = this._leaflet_round
	},

	draw() {
		this._disableLeafletRounding()
		this._redraw(this.selection, this.projection, this.map.getZoom())
		this._enableLeafletRounding()
	},
	getEvents: function() { return {zoomend: this._zoomChange} },
	_zoomChange: function (evt) {
		this._disableLeafletRounding()
		let newZoom = this._undef(evt.zoom) ? this.map._zoom : evt.zoom // "viewreset" event in Leaflet has not zoom/center parameters like zoomanim
		this._zoomDiff = newZoom - this._zoom
		this._scale = Math.pow(2, this._zoomDiff)
		this.projection.scale = this._scale
		this._shift = this.map.latLngToLayerPoint(this._wgsOrigin)
				._subtract(this._wgsInitialShift.multiplyBy(this._scale))

		let shift = ["translate(", this._shift.x, ",", this._shift.y, ") "]
		let scale = ["scale(", this._scale, ",", this._scale,") "]
		this._rootGroup.attr("transform", shift.concat(scale).join(""))

		this.draw()
		this._enableLeafletRounding()
	},
	_redraw(selection, projection, zoom){
		// Generate the mapped version of the data
		let data = this._data.map( (d) => {
			let lng = this.options.lng(d)
			let lat = this.options.lat(d)

			let point = projection.latLngToLayerPoint([lat, lng])
			return { o: d, point: point }
		});

		// Select the hex group for the current zoom level. This has
		// the effect of recreating the group if the zoom level has changed
		let join = selection.selectAll('g.hexbin')
			.data([zoom], (d) => d)

		// enter
		join.enter().append('g')
			.attr('class', (d) => 'hexbin zoom-' + d)

		// exit
		join.exit().remove();

		// add the hexagons to the select
		this._createHexagons(join, data, projection)

	},

	_createHexagons(g, data, projection) {
		// Create the bins using the hexbin layout
		let hexbin = d3.hexbin()
			.radius(this.options.radius / projection.scale)
			.x( (d) => d.point.x )
			.y( (d) => d.point.y )
		let bins = hexbin(data)
		// Determine the extent of the values
		let extent = d3.extent(bins, (d) => this.options.value(d) )
		if(extent[0] == null) extent[0] = 0
		if(extent[1] == null) extent[1] = 0
		if(null != this.options.valueFloor) extent[0] = this.options.valueFloor
		if(null != this.options.valueCeil) extent[1] = this.options.valueCeil

		// Match the domain cardinality to that of the color range, to allow for a polylinear scale
		let domain = this._linearlySpace(extent[0], extent[1], this._colorScale.range().length)

		this._colorScale.domain(domain)

		// Join - Join the Hexagons to the data
		let join = g.selectAll('path.hexbin-hexagon')
			.data(bins)

		// Update - set the fill and opacity on a transition (opacity is re-applied in case the enter transition was cancelled)
		join.transition().duration(this.options.duration)
			.attr('fill', (d) => this._colorScale(this.options.value(d)) )
			.attr('fill-opacity', this.options.opacity)
			.attr('stroke-opacity', this.options.opacity)

		// Enter - establish the path, the fill, and the initial opacity
		join.enter().append('path').attr('class', 'hexbin-hexagon')
			.attr('d', (d) => 'M' + d.x + ',' + d.y + hexbin.hexagon() )
			.attr('fill', (d) => this._colorScale(this.options.value(d)) )
			.attr('fill-opacity', 0.01)
			.attr('stroke-opacity', 0.01)
			.on('mouseover', this.options.mouseover)
			.on('mouseout', this.options.mouseout)
			.transition().duration(this.options.duration)
				.attr('fill-opacity', this.options.opacity)
				.attr('stroke-opacity', this.options.opacity);

		// Exit
		join.exit().transition().duration(this.options.duration)
			.attr('fill-opacity', 0.01)
			.attr('stroke-opacity', 0.01)
			.remove()

	},

	_project(coord) {
		let point = this._map.latLngToLayerPoint([ coord[1], coord[0] ])
		return [ point.x, point.y ]
	},

	_linearlySpace(from, to, length){
		let arr = new Array(length)
		let step = (to - from) / Math.max(length - 1, 1)

		for (let i = 0; i < length; ++i) {
			arr[i] = from + (i * step)
		}

		return arr
	},

	data(data) {
		this._data = (null != data)? data : []
		this.draw()
		return this
	}
})
