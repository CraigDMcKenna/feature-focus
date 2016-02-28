import express from 'express'
import r from 'rethinkdb'
import bodyParser from 'body-parser'
import config from './config'

let app = express()

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


// *****************
// *      API      *
// *****************

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let router = express.Router()

// All API routes on '/api' path
app.use('/api', router)

// Clients
router.route('/clients')

  .get((req, res) => {
    
    r.table('clients')
      .run(res._rdbConn).then((cursor) => {
        return cursor.toArray()
      })
      .then((result) => {
        res.json(result)
      })
  })


// Feature Requests
router.route('/feature-requests')

  // Create Feature Request
  .post((req, res) => {
    let request = req.body
    request.creationDate = r.now()
    request.isActive = true
    request.createdBy = 'default employee' // change to authenticated user when login is implemented
    
    // Insert
    r.table('feature_requests')
      .insert(request, {returnChanges: true})
      .run(res._rdbConn)
      .then((result) => {
        if (result.inserted !== 1) {
          console.log('Error: document not inserted!')
        } else {
          res.json(result.changes[0].new_val)
          return // generated id
        }
      })
      .then(
        // Re-prioritize any requests >= this request
        r.table('feature_requests')
          .indexWait('clientId')
          .run(res._rdbConn)
          .then(
            r.table('feature_requests')
              .getAll(request.clientId, {index: 'clientId'})
              .filter((req) => {
                return (
                  // req >= request.priority
                  req('priority').eq(r.js(request.priority))
                  .or(req('priority').gt(r.js(request.priority)))
                  // not this request
                )
              })
              .update({
                priority: r.row('priority').add(1)
              })
              .run(res._rdbConn)
          )       
      )
  })

  // Get all Feature Requests
  .get((req, res) => {
    
    r.table('feature_requests')
    .run(res._rdbConn)
    .then((cursor) => {
      return cursor.toArray()
    })
    .then((result) => {
      res.json(result)
    })
  })
  
// Feature Requests By Client id
router.route('/feature-requests/:id') 

  .get((req, res) => {
    
    r.table('feature_requests')
      .indexWait('clientId')
      .run(res._rdbConn)
      .then(
        r.table('feature_requests')
          .getAll(req.params.id, {index: 'clientId'})
          .run(res._rdbConn).then((cursor) => {
            return cursor.toArray()
          })
          .then((result) => {
            res.json(result)
          })
      )
  })

// Products
router.route('/products')

  .get((req, res) => {
    
    r.table('products')
      .run(res._rdbConn)
      .then((cursor) => {
        return cursor.toArray()
      })
      .then((result) => {
        res.json(result)
      })
  })


// ********************
// *      Server      * 
// ********************

const IS_DEV = process.env.npm_lifecycle_event === 'start'

// IS_DEV ? dev server : prod server
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
  
  app.use(express.static('public'))
  
  app.listen(process.env.PORT)
}

export default app
