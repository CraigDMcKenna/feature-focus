import request from 'superagent'

export default {
  
  // optional paramater: clientId
  // return feature requests per client
  // if undefined return all feature requests
  
  getRequests: (clientId, callback) => {
    let url = 'api/feature-requests'
       
    if (clientId) {
      url = `${url}/${clientId}`
    }
    
    request
      .get(url)
      .end((err, res) => {
        if (err) console.log(err)
        
        callback(res.body)
    })
  }
}
