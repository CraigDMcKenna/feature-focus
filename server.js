import express from 'express'
import r from 'rethinkdb'
import nJwt from 'njwt'
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

app.set('secret', config.secret)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let router = express.Router()

// All API routes on '/api' path
app.use('/api', router)


// Auth
router.route('/auth')

  .post((req, res) => {

    r.table('users')
     .getAll(req.body.email, {index: 'email'})
     .getField('password')
     .contains(req.body.password)
     .run(res._rdbConn)
     .then((result) => {

       if (!result) {
         res.json({success: false, message: 'Authentication failed. Invalid email and/or password.'})
       } else {

         r.table('users')
         .getAll(req.body.email, {index: 'email'})
         .pluck('name', 'id')
         .run(res._rdbConn)
         .then((cursor) => cursor.toArray())
         .then((result) => {
           let user = result[0]

           let claims = {
             //iss: 'localhost',
             sub: `users/${user.id}`,
             scope: 'user'
           }

           let jwt = nJwt.create(claims, app.get('secret'))
           // for now set no expiration on token
           jwt.setExpiration()
           let token = jwt.compact()

           res.json({
             success: true,
             message: 'Authentication successful.',
             user_id: user.id,
             user_firstname: user.name.first,
             user_lastname: user.name.last,
             token: token
           })

         })
       }
     })
   })


// Guard remaining routes
router.use((req, res, next) => {
  let token = req.headers['x-access-token'] || req.body.token || req.query.token

  if (token) {
    nJwt.verify(token, app.get('secret'), (err, verifiedJwt) => {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' })
      } else {
        req.verifiedJwt = true
        next()
      }

    })
  } else {
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    })
  }
})


// Auth verify (for client side routing)
router.route('/auth/validate')

  .get((req, res) => {
    res.json({ success: true, message: 'Token valid.' })
  })


// Users: get all users ordered by name
router.route('/users')

  .get((req, res) => {

    r.table('users')
      .orderBy('name')
      .run(res._rdbConn)
      .then((cursor) => {
        return cursor.toArray()
      })
      .then((result) => {
        res.json(result)
      })
  })


// Users: get all following by user :id
router.route('/user/all-following/:id')

  .get((req,res) => {

    r.table('users')
    .get(req.params.id)('following')
    .eqJoin('requestId', r.table('feature_requests'))
    .without({left: 'requestId'})
    .zip()
    .eqJoin('clientId', r.table('clients'))
    .without({right: 'id'})
    .zip()
    .run(res._rdbConn)
    .then((result) => res.json(result))
  })


// Users: get user following status of request
// for given feature_requst id (:id) and user id
router.route('/user/following/:id')

  .get((req,res) => {

    r.table('users')
    .get(req.headers['x-user-id'])('following')
    .filter((row) => {
      return row('requestId').eq(req.params.id)
    })
    .run(res._rdbConn)
    .then((result) => {
      let response = result.length ? true : false

      res.json({following: response})
    })
  })


// User follow feature request given
// { userId: <userId>, requestId: <requestId> }
router.route('/user/follow')

  .post((req, res) => {
    r.table('users')
      .get(req.body.userId)('following')
      .append({requestId: req.body.requestId})
      .run(res._rdbConn)
      .then((result) => {
        r.table('users')
          .get(req.body.userId)  // comment out this line to apply to all users
          .update({ following: result })
          .run(res._rdbConn)
          .then((result) => res.json(result))
      })
  })


// User unfollow feature request given
// { userId: <userId>, requestId: <requestId> }
router.route('/user/unfollow')

  .post((req, res) => {
    r.table('users')
      .get(req.body.userId)('following')
      .filter((row) => {
        return row('requestId').ne(req.body.requestId)
      })
      .run(res._rdbConn)
      .then((result) => {
        r.table('users')
          .get(req.body.userId)  // comment out this line to apply to all users
          .update({ following: result })
          .run(res._rdbConn)
          .then((result) => res.json(result))
      })
  })


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

    // Insert
    r.table('feature_requests')
      .insert(request, {returnChanges: true})
      .run(res._rdbConn)
      .then((result) => {
        if (result.inserted !== 1) {
          console.log('Error: document not inserted!')
        } else {
          return result.changes[0].new_val //.id
        }
      })
      .then((result) => {
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
          .then(
            r.table('feature_request_history')
              .insert({
                requestId: result.id,
                messages: [{
                  timestamp: r.now().toEpochTime(),
                  authorId: result.createdBy,
                  type: 'update',
                  message: 'Created Feature Request'
                }]
              })
              .run(res._rdbConn)
              .then(res.json(result))
          )
      })
  })

  // Get all Feature Requests equal join clients and products without redundant ids
  .get((req, res) => {

    r.table('feature_requests')
      .eqJoin('clientId', r.table('clients'))
      .without({right: 'id'})
      .zip()
      .eqJoin('productId', r.table('products'))
      .without({right: 'id'})
      .zip()
      .run(res._rdbConn)
      .then((cursor) => {
      return cursor.toArray()
    })
    .then((result) => {
      res.json(result)
    })
  })


// Update Feature Request return changes

router.route('/feature-request/update')

  .post((req, res) => {
    let request = req.body

    r.table('feature_requests')
      .get(request.id)
      .update({[request.updateItem] : request.value}, {returnChanges: true})
      .run(res._rdbConn)
      .then((result) => res.json(result.changes))

  })


// Single Feature Request by id, merge all ids
router.route('/feature-requests/request/:id')

  .get((req, res) => {

    r.table('feature_requests')
      .get(req.params.id)
      .merge((item) => {
        return {
          createdByName: r.table('users').get(item('createdBy')).pluck('name'),
          ownerName: r.table('users').get(item('owner')).pluck('name'),
          ownerAvatar: r.table('users').get(item('owner')).pluck('avatar'),
          clientName: r.table('clients').get(item('clientId')).pluck('name'),
          productName: r.table('products').get(item('productId')).pluck('productName')
        }
      })
      .run(res._rdbConn)
      .then((result) => {
        res.json(result)
      })
  })

// Feature Requests By Client id
router.route('/feature-requests/client/:id')

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

// Feature Requests By User id equal join with clients without redundant ids
router.route('/feature-requests/user/:id')

  .get((req, res) => {

    r.table('feature_requests')
      .indexWait('owner')
      .run(res._rdbConn)
      .then(
        r.table('feature_requests')
          .eqJoin('clientId', r.table('clients'))
          .without({right: 'id'})
          .zip()
          .filter({'owner': req.params.id})
          .run(res._rdbConn).then((cursor) => {
            return cursor.toArray()
          })
          .then((result) => {
            res.json(result)
          })
    )
  })

// Feature Request History

// insert new history update by id where :id is feature_request id
// and the key is a rethinkdb timestamp
router.route('/feature-request/history/insert')

  .post((req, res) => {

    let request = req.body

    r.table('feature_request_history')
      .get(request.id)
      .update({
        messages: r.row('messages')
        .append({
          type: request.type,
          timestamp: r.now().toEpochTime(),
          authorId: request.authorId,
          message: request.message
        })
      })
      .run(res._rdbConn)
      .then(result => res.json(result))
  })

 // Feature request history by feature_requst id
 router.route('/feature-request/history/:id')

  .get((req, res) => {
    r.table('feature_request_history')
      .get(req.params.id)
      .merge(history => {
        return {messages: history('messages')
          .map(message => {
            return (
              message.merge((row) => {
                return (
                  r.table('users')
                  .get(row('authorId'))
                  .pluck('name')
                )
              })
            )
          })
        }
      })
      .run(res._rdbConn)
      .then(result => res.json(result))
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
