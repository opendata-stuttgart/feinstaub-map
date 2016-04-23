import gulp from 'gulp'
import ghPages from 'gulp-gh-pages'

import webpack from 'webpack-stream'
import config from './webpack.production.config.js'

gulp.task('deploy', () => {
	return gulp.src('src/main.js')
		.pipe(webpack(config))
		.pipe(ghPages())
	})
