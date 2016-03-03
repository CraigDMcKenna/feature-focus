import request from 'superagent'

export default {
  login(email, pass, cb) {
    cb = arguments[arguments.length - 1]
    if (localStorage.token && this.activeUser()) {
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
        localStorage.last_active = Date.now()
        if (cb) cb(true)
        this.onChange(true)
      } else {
        if (cb) cb(false)
        this.onChange(false)
      }
    })
  },

  // I think this is useless
  // and can probably be deleted
  getToken() {
    return localStorage.token
  },

  logout(cb) {
    delete localStorage.token
    delete localStorage.user_firstname
    delete localStorage.user_lastname
    delete localStorage.user_id
    delete localStorage.last_active
    if (cb) cb()
    this.onChange(false)
  },

  activeUser() {
    let i = parseInt(localStorage.last_active)

    return (
      localStorage.last_active &&
      (i + 3600000) >= Date.now() ?
      localStorage.last_active = Date.now() :
      false
    )
  },


  loggedIn() {
    return !!localStorage.token
  },

  // not using currently
  validateUser(callback) {
    request
      .get('api/auth/validate')
      .set('x-access-token', localStorage.token)
      .end((err, res) => {
        let result = JSON.parse(res.text)
        callback(result.success)
    })
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
