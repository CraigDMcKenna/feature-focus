import request from 'superagent'

export default {
  login(email, pass, cb) {
    cb = arguments[arguments.length - 1]
    if (localStorage.token) {
      if (cb) cb(true)
      this.onChange(true)
      return
    }
    authenticate(email, pass, (res) => {
      if (res.authenticated) {
        localStorage.token = res.token
        localStorage.user_firstname = res.user_firstname
        localStorage.user_lastname = res.user_lastname
        localStorage.user_id = res.user_id
        if (cb) cb(true)
        this.onChange(true)
      } else {
        if (cb) cb(false)
        this.onChange(false)
      }
    })
  },

  getToken() {
    return localStorage.token
  },

  logout(cb) {
    delete localStorage.token
    if (cb) cb()
    this.onChange(false)
  },

  loggedIn() {
    return !!localStorage.token
  },

  onChange() {}
}

function authenticate (email, pass, callback) {
  let body = {email: email, password: pass}

  request
    .post('api/auth')
    .send(body)
    .end((err, res) => {
      let result = JSON.parse(res.text)

      if (result.success) {
        callback({
          authenticated: true,
          user_id: result.user_id,
          user_firstname: result.user_firstname,
          user_lastname: result.user_lastname,
          token: result.token
        })
      } else {
        callback({ authenticated: false} )
      }
  })
}
