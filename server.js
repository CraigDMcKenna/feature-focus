import express from 'express'

let app = express()

const TARGET = process.env.npm_lifecycle_event

// Dev Server
if (TARGET === 'start') {
  let webpack = require('webpack')
  let webpackConfig = require('./build/webpack.dev.config')
  let compiler = webpack(webpackConfig)

  app.use(require('webpack-dev-middleware')(compiler, {
    reload: true,
    overlay: true,
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))

  app.use(require('webpack-hot-middleware')(compiler))
}

app.use(express.static('public'))

app.listen(3000, '0.0.0.0', () => console.log('Listening on port 3000'))

export default app
