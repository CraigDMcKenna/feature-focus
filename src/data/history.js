import request from 'superagent'

export default {

  getHistoryById: (requestId, callback) => {
    let uri = `api/feature-request/history/${requestId}`

    request
      .get(uri)
      .set('x-access-token', localStorage.token)
      .end((err, res) => {
        if (err) console.log(err)

        callback(res.body)
    })
  },

  insertHistoryMessage: (message, callback) => {
      let uri = 'api/feature-request/history/insert'

      request
        .post(uri)
        .set('x-access-token', localStorage.token)
        .send(message)
        .end((err, res) => {
          if (err) console.log(err)

          callback(res.body)
      })
  }
}
