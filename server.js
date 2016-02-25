import express from 'express'
import r from 'rethinkdb'
import bodyParser from 'body-parser'
import config from './config'

let app = express()

// True if started via npm start script
const IS_DEV = process.env.npm_lifecycle_event === 'start'

// static 
app.use(express.static('public'))

// DB Connection
let rdbConn;

app.use(createConnection)

function createConnection(req, res, next) {
  r.connect(config.rethinkdb).then((conn) => {
      res._rdbConn = conn
      next()
  })
}


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// API routes
let router = express.Router()

// All api routes will begin with '/api'
app.use('/api', router)

// Clients Route
router.route('/clients')

.get((req, res) => {
  r.table('clients').run(res._rdbConn).then((cursor) => {
    return cursor.toArray()
  }).then((result) => {
    res.json(result)
  })
})







// Dev server if in Development, otherwise listen on env port
if (IS_DEV) {
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
