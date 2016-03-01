import request from 'superagent'

export default {

  // optional paramater: clientId
  // return feature requests per client
  // if undefined return all feature requests
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
    let url = `api/feature-requests/request${id}`

    request
      .get(url)
      .set('x-access-token', localStorage.token)
      .end((err, res) => {
        if (err) console.log(err)

        callback(res.body)
    })
  },

  getRequestsByClient: (clientId, callback) => {
    let url = `api/feature-requests/client${clientId}`

    request
      .get(url)
      .set('x-access-token', localStorage.token)
      .end((err, res) => {
        if (err) console.log(err)

        callback(res.body)
    })
  },

  getRequestsByUser: (userId, callback) => {
    let url = `api/feature-requests/user${userId}`

    request
      .get(url)
      .set('x-access-token', localStorage.token)
      .end((err, res) => {
        if (err) console.log(err)

        callback(res.body)
    })
  },

  createRequest: (submission, callback) => {
      let url = 'api/feature-requests'

      request
        .post(url)
        .set('x-access-token', localStorage.token)
        .send(submission)
        .end((err, res) => {
          if (err) console.log(err)

          callback(res.body)
      })
  }
}
