import request from 'superagent'

export default {

  allUsers: (callback) => {
    request
      .get('api/users')
      .set('x-access-token', localStorage.token)
      .end((err, res) => {
        if (err) console.log(err)

        callback(res.body)
    })
  },

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

  userAllFollowing: (userId, callback) => {
    request
      .get(`api/user/all-following/${userId}`)
      .set('x-access-token', localStorage.token)
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
