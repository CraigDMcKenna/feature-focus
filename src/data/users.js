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
  }
}
