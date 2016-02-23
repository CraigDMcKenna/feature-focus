var path = require('path');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, '../src/index.jsx')
  ],

  output: {
    path: path.join(__dirname, '../public/'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',  // babel ?
        include: path.join(__dirname, '../src')
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
      }
    ]
  },

  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Feature Focus',
      template: path.join(__dirname, '../src/index.template.html'),
      inject: true
    })
  ],

  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
