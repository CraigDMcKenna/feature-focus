import request from 'superagent'

export default {
  
  getClients: (callback) => {
    request
      .get('api/clients')
      .set('x-access-token', localStorage.token)
      .end((err, res) => {
        if (err) console.log(err)
        
        callback(res.body)        
    })
  }
} 
