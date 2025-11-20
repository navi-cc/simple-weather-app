const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
	mode: 'development',
	devtool: 'eval-source-map',
	devServer: {
		open: {
			app: {
				name: 'chrome',
			},
		},

		watchFiles: ['./src/app/index.html'],
	},
})
