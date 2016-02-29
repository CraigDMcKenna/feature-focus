import request from 'superagent'

export default {
  
  getProducts: (callback) => {
    request
      .get('api/products')
      .set('x-access-token', localStorage.token)
      .end((err, res) => {
        if (err) console.log(err)

        callback(res.body)        
    })
  }
}
