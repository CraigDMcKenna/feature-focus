import request from 'superagent'

export default {
  
  getClients: (callback) => {
    request
      .get('api/clients')
      .end((err, res) => {
        if (err) console.log(err)
        
        callback(res.body)        
    })
  }
} 
