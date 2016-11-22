var webpack = require('webpack')
var merge = require('webpack-merge')
var path = require('path')
var projectRoot = path.resolve(__dirname, '../')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
	baseWebpackConfig.entry[name] = ['./build/dev-shim'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
	module: {
		loaders: utils.styleLoaders()
	},
	resolve: {
		alias: {
			'config': path.resolve(projectRoot, 'config.js'),
		}
	},
	// eval-source-map is faster for development
	devtool: '#source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': '"development"',
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			inject: true
		})
	]
})
