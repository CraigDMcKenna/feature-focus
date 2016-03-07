import request from 'superagent'

export default {

  userIsFollowing: (requestId, callback) => {
    request
      .get(`api/user/following/${requestId}`)
      .set('x-access-token', localStorage.token)
      .set('x-user-id', localStorage.user_id)
      .end((err, res) => {
        if (err) console.log(err)

        callback(res.body)
    })
  },

  userFollow: (requestId, userId, callback) => {
    let requestBody = {
      requestId: requestId,
      userId: userId
    }

    request
      .post('api/user/follow')
      .set('x-access-token', localStorage.token)
      .send(requestBody)
      .end((err, res) => {
        if (err) console.log(err)

        callback(res.body)
    })
  },

  userUnfollow: (requestId, userId, callback) => {
    let requestBody = {
      requestId: requestId,
      userId: userId
    }

    request
      .post('api/user/unfollow')
      .set('x-access-token', localStorage.token)
      .send(requestBody)
      .end((err, res) => {
        if (err) console.log(err)

        callback(res.body)
    })
  }
}
