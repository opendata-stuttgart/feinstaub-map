// https://github.com/Asymmetrik/leaflet-d3/blob/master/src/js/hexbin/HexbinLayer.js
import L from 'leaflet'
import d3 from 'd3'
import d3Hexbin from 'd3-hexbin'

d3.hexbin = d3Hexbin.hexbin

L.HexbinLayer = L.Layer.extend({
	_undef(a) { return typeof a == "undefined" },
	options : {
		radius : 10,
		opacity: 0.5,
		duration: 200,
		valueFloor: undefined,
		valueCeil: undefined,
		colorRange: ['#FF0000', '#08306b'],

		onmouseover: undefined,
		onmouseout: undefined,
		click: undefined
	},

	initialize(options) {
		L.setOptions(this, options);

		this._hexLayout = d3.hexbin()
			.radius(this.options.radius)
			.x(function(d){ return d.point.x; })
			.y(function(d){ return d.point.y; });

		this._data = [];
		this._colorScale = d3.scale.linear()
			.range(this.options.colorRange)
			.clamp(true);

	},

	onAdd(map) {
		this.map = map
		let _layer = this

		// SVG element
		this._svg = L.svg()
		map.addLayer(this._svg)
		this._rootGroup = d3.select(this._svg._rootGroup).classed("d3-overlay", true)

		// this._rootGroup.classed("leaflet-zoom-hide", this.options.zoomHide)
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
						var projectedPoint = _layer.map.project(L.latLng(latLng), zoom)._round()
						return projectedPoint._subtract(_layer._pixelOrigin)
				},
				layerPointToLatLng: function (point, zoom) {
						zoom = _layer._undef(zoom) ? _layer._zoom : zoom
						var projectedPoint = L.point(point).add(_layer._pixelOrigin)
						return _layer.map.unproject(projectedPoint, zoom)
				},
				unitsPerMeter: 256 * Math.pow(2, _layer._zoom) / 40075017,
				map: _layer.map,
				layer: _layer,
				scale: 1
		}
		this.projection._projectPoint = function(x, y) {
				var point = _layer.projection.latLngToLayerPoint(new L.LatLng(y, x))
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
		this.draw();

		// Set up events
		// map.on({'moveend': this._redraw}, this);
	},

	onRemove(map) {
		this._destroyContainer();

		// Remove events
		map.off({'moveend': this._redraw}, this);

		this._container = null;
		this._map = null;

		// Explicitly will leave the data array alone in case the layer will be shown again
		//this._data = [];
	},

	addTo(map) {
		map.addLayer(this);
		return this;
	},

	_destroyContainer(){
		// Remove the svg element
		if(null != this._container){
			this._container.remove();
		}
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
	getEvents: function() { return {zoomend: this._zoomChange}; },
	_zoomChange: function (evt) {
		this._disableLeafletRounding();
		var newZoom = this._undef(evt.zoom) ? this.map._zoom : evt.zoom; // "viewreset" event in Leaflet has not zoom/center parameters like zoomanim
		this._zoomDiff = newZoom - this._zoom;
		this._scale = Math.pow(2, this._zoomDiff);
		this.projection.scale = this._scale;
		this._shift = this.map.latLngToLayerPoint(this._wgsOrigin)
				._subtract(this._wgsInitialShift.multiplyBy(this._scale));

		var shift = ["translate(", this._shift.x, ",", this._shift.y, ") "];
		var scale = ["scale(", this._scale, ",", this._scale,") "];
		this._rootGroup.attr("transform", shift.concat(scale).join(""));

		if (this.options.zoomDraw) { this.draw() }
		this._enableLeafletRounding();
	},
	// (Re)draws the hexbin group
	_redraw(selection, projection, zoom){
		var that = this;

		// Generate the mapped version of the data
		var data = that._data.map(function(d) {
			var lng = that.options.lng(d);
			var lat = that.options.lat(d);

			var point = projection.latLngToLayerPoint([lat, lng]);
			return { o: d, point: point };
		});

		// Select the hex group for the current zoom level. This has
		// the effect of recreating the group if the zoom level has changed
		var join = selection.selectAll('g.hexbin')
			.data([zoom], function(d){ return d; });

		// enter
		join.enter().append('g')
			.attr('class', function(d) { return 'hexbin zoom-' + d; });

		//enter + update
		// join.attr('transform', 'translate(1,1)');

		// exit
		join.exit().remove();

		// add the hexagons to the select
		this._createHexagons(join, data);

	},

	_createHexagons(g, data) {
		var that = this;

		// Create the bins using the hexbin layout
		var bins = that._hexLayout(data);
		console.log(data, bins)
		// Determine the extent of the values
		var extent = d3.extent(bins, function(d){
			return that.options.value(d);
		});
		if(null == extent[0]) extent[0] = 0;
		if(null == extent[1]) extent[1] = 0;
		if(null != that.options.valueFloor) extent[0] = that.options.valueFloor;
		if(null != that.options.valueCeil) extent[1] = that.options.valueCeil;

		// Match the domain cardinality to that of the color range, to allow for a polylinear scale
		var domain = that._linearlySpace(extent[0], extent[1], that._colorScale.range().length);

		// Set the colorscale domain
		that._colorScale.domain(domain);

		// Join - Join the Hexagons to the data
		var join = g.selectAll('path.hexbin-hexagon')
			.data(bins, function(d){ return d.x + ':' + d.y; });

		// Update - set the fill and opacity on a transition (opacity is re-applied in case the enter transition was cancelled)
		join.transition().duration(that.options.duration)
			.attr('fill', function(d){ return that._colorScale(that.options.value(d)); })
			.attr('fill-opacity', that.options.opacity)
			.attr('stroke-opacity', that.options.opacity);

		// Enter - establish the path, the fill, and the initial opacity
		join.enter().append('path').attr('class', 'hexbin-hexagon')
			.attr('d', function(d){ return 'M' + d.x + ',' + d.y + that._hexLayout.hexagon(); })
			.attr('fill', function(d){ return that._colorScale(that.options.value(d)); })
			.attr('fill-opacity', 0.01)
			.attr('stroke-opacity', 0.01)
			.on('mouseover', function(d, i) {
				if(null != that.options.onmouseover) {
					that.options.onmouseover(d, this, that);
				}
			})
			.on('mouseout', function(d, i) {
				if(null != that.options.onmouseout) {
					that.options.onmouseout(d, this, that);
				}
			})
			.on('click', function(d, i) {
				if(null != that.options.onclick) {
					that.options.onclick(d, this, that);
				}
			})
			.transition().duration(that.options.duration)
				.attr('fill-opacity', that.options.opacity)
				.attr('stroke-opacity', that.options.opacity);

		// Exit
		join.exit().transition().duration(that.options.duration)
			.attr('fill-opacity', 0.01)
			.attr('stroke-opacity', 0.01)
			.remove();

	},

	_project(coord) {
		var point = this._map.latLngToLayerPoint([ coord[1], coord[0] ]);
		return [ point.x, point.y ];
	},

	_linearlySpace(from, to, length){
		var arr = new Array(length);
		var step = (to - from) / Math.max(length - 1, 1);

		for (var i = 0; i < length; ++i) {
			arr[i] = from + (i * step);
		}

		return arr;
	},

	/*
	 * Setter for the data
	 */
	data(data) {
		this._data = (null != data)? data : [];
		this.draw();
		return this;
	},

	/*
	 * Getter/setter for the colorScale
	 */
	colorScale(colorScale) {
		if(undefined === colorScale){
			return this._colorScale;
		}

		this._colorScale = colorScale;
		this.draw();
		return this;
	},

	/*
	 * Getter/Setter for the value function
	 */
	value(valueFn) {
		if(undefined === valueFn){
			return this.options.value;
		}

		this.options.value = valueFn;
		this.draw();
		return this;
	},

	/*
	 * Getter/setter for the mouseover function
	 */
	onmouseover(mouseoverFn) {
		this.options.onmouseover = mouseoverFn;
		this.draw();
		return this;
	},

	/*
	 * Getter/setter for the mouseout function
	 */
	onmouseout(mouseoutFn) {
		this.options.onmouseout = mouseoutFn;
		this.draw();
		return this;
	},

	/*
	 * Getter/setter for the click function
	 */
	onclick(clickFn) {
		this.options.onclick = clickFn;
		this._redraw();
		return this;
	}

});
