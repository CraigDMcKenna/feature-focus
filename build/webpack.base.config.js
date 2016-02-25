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
        loader: 'babel-loader',
        include: path.join(__dirname, '../src')
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
      },
      {
        test: /\.(png|svg)$/,
        loader: "url-loader?limit=1024",
        include: path.join(__dirname, '../src/images'),
      }
    ]
  },

  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/index.ejs'),
      title: 'Feature Focus',
      description: 'Manage Customer Feature Requests',
      favicon: path.join(__dirname, '../src/images/favicon.ico')
    })
  ],

  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
