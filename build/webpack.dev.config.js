var path = require('path')
var webpack = require('webpack')
var config = require('./webpack.base.config.js')

config.devtool = 'eval-source-map',

config.entry.push('webpack-hot-middleware/client')

config.module.loaders.unshift({
  test: /\.jsx?/,
  loader: 'react-hot',
  include: path.join(__dirname, '../src')
})

config.plugins = (config.plugins || []).concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
])

module.exports = config
