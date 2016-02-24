import express from 'express'

let app = express()

const TARGET = process.env.npm_lifecycle_event

app.use(express.static('public'))

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
  
  app.listen(3000, '0.0.0.0', () => console.log('App available at localhost:3000'))
} else {
  
  app.listen(process.env.PORT)
}


export default app
