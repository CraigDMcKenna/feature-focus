import React from 'react'
import featureRequests from '../../data/feature-requests'

export default class Request extends React.Component {
  constructor(){
    super()

    this.state = {
      request: []
    }

    this.loadRequest = this.loadRequest.bind(this)
  }

  loadRequest(id) {
    featureRequests.getRequestById(id, (response) => {
      this.setState({request: response})
    })
  }

  componentDidMount() {
    this.loadRequest(this.props.params.id)
  }

  render() {
    let request = JSON.stringify(this.state.request)
    return (
      <div>
        <h1>Feature Request</h1>
        {request}
      </div>
    )
  }
}
