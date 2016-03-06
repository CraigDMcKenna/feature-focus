import request from 'superagent'

export default {

  getRequests: (callback) => {
    request
      .get('api/feature-requests')
      .set('x-access-token', localStorage.token)
      .end((err, res) => {
        if (err) console.log(err)

        callback(res.body)
    })
  },

  getRequestById: (id, callback) => {
    let uri = `api/feature-requests/request/${id}`

    request
      .get(uri)
      .set('x-access-token', localStorage.token)
      .end((err, res) => {
        if (err) console.log(err)

        callback(res.body)
    })
  },

  getRequestsByClient: (clientId, callback) => {
    let uri = `api/feature-requests/client/${clientId}`

    request
      .get(uri)
      .set('x-access-token', localStorage.token)
      .end((err, res) => {
        if (err) console.log(err)

        callback(res.body)
    })
  },

  getRequestsByUser: (userId, callback) => {
    let uri = `api/feature-requests/user/${userId}`

    request
      .get(uri)
      .set('x-access-token', localStorage.token)
      .end((err, res) => {
        if (err) console.log(err)

        callback(res.body)
    })
  },

  createRequest: (submission, callback) => {
      request
        .post('api/feature-requests')
        .set('x-access-token', localStorage.token)
        .send(submission)
        .end((err, res) => {
          if (err) console.log(err)

          callback(res.body)
      })
  },


/***
    <request_body_format> = {
      id: <feature_request_id>,
      updateItem: <item_to_update>,  // title || description...
      value: <new_value>
    }

    // will return array ->
      [
        {
          new_val : { <new_feature_request_values> }
        },
        {
          old_val : { <feature_request_values> }
        }
     ]

   // or empty array if no changes
*/


 updateRequest: (submission, callback) => {
     request
        .post('api/feature-request/update')
        .set('x-access-token', localStorage.token)
        .send(submission)
        .end((err, res) => {
          if (err) console.log(err)

          callback(res.body)
      })
 }
}
