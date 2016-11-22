var ghpages = require('gh-pages')
var path = require('path')

var distPath = path.resolve(__dirname, '../dist')
ghpages.publish(distPath, {
}, function (err) {
	if (err)
		console.error('ghpages failed', err)
	else
		console.log('ghpages successfully deployed')
})
