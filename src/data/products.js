import request from 'superagent'

export default {
  
  getProducts: (callback) => {
    request
      .get('api/products')
      .end((err, res) => {
        if (err) console.log(err)

        callback(res.body)        
    })
  }
}
