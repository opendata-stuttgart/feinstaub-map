var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	entry: [
		'babel-polyfill',
		'./src/style.styl',
		'./src/main',
		// 'webpack-dev-server/client?http://localhost:8080'
	],
	output: {
			publicPath: '/',
			filename: 'main.js'
	},
	debug: true,
	devtool: 'source-map',
	module: {
		loaders: [
			{ test: /\.js$/, include: path.join(__dirname, 'src'), loader: 'babel-loader', query: { presets: ['es2015'] }},
			{ test: /\.jade$/, loader: "html!jade-html" },
			{ test: /\.styl$/, loader: 'style!css!stylus' },
			{ test: /\.css$/, loader: 'style!css' },
			{ test: /\.(png|jpg)$/, loader: 'file-loader' }
			// { test: /\.less$/, loader: "style!css!autoprefixer!less" },
		]
	},
	devServer: {
		contentBase: "./src"
	},
  plugins: [new HtmlWebpackPlugin({
		template: './src/index.html'
	})],
	stylus: {
		use: [require('nib')(),require('axis')(),require('rupture')(),require('autoprefixer-stylus')()]
	}
};
