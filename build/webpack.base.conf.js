var path = require('path')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')

module.exports = {
	entry: {
		app: './src/main.js'
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		publicPath: '/',
		filename: '[name].js'
	},
	resolve: {
		extensions: ['', '.js', '.json', '.vue'],
		modules: [path.resolve(__dirname, "../src"), path.resolve('src/styles'), path.join(__dirname, '../node_modules')]
	},
	module: {
		loaders: [
			{ test: /\.vue$/, loader: 'vue' },
			{ test: /\.js$/, loader: 'babel', include: projectRoot, exclude: /node_modules\/(?!buntpapier)/ },
			{ test: /\.json$/, loader: 'json' },
			{ test: /\.html$/, loader: 'vue-html' },
			{test: /\.svg(\?.*)?/, loader: 'svg-url',
				query: {
					noquotes: true,
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
			}},
			{ test: /\.(png|jpe?g|gif)(\?.*)?$/, loader: 'url',
				query: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
			}},
			{ test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, loader: 'url',
				query: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
			}}
		]
	},
	vue: {
		loaders: utils.cssLoaders()
	},
	stylus: {
		use: [require('nib')(), require('rupture')(), require('autoprefixer-stylus')(), require('buntpapier/stylus')()]
	}
}
