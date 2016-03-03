import React from 'react'
import DataContainer from '../DataContainer'
import Moment from 'moment'
import clients from '../../data/clients'
import products from '../../data/products'
import featureRequests from '../../data/feature-requests'
import styles from './styles.css'

export default class Dashboard extends React.Component {
  constructor() {
    super()

    this.state = {
      messageVisible: true,
      featureRequests: [],
      requestsByUser: [],
      dueThisWeek: [],
      following: []
    }

    this.loadRequests = this.loadRequests.bind(this)
    this.loadRequestsByUser = this.loadRequestsByUser.bind(this)
  }

  loadRequests() {
    featureRequests.getRequests((response) => {
      let endOfWeek = Moment().endOf('isoWeek')

      let due  = response.filter(request => {
        return Moment(request.targetDate).isBefore(endOfWeek)
      })

      this.setState({featureRequests: response})
      this.setState({dueThisWeek: due})
    })
  }

  loadRequestsByUser(userId) {
    featureRequests.getRequestsByUser(userId, (response) => {
      this.setState({requestsByUser: response})
    })
  }

  componentDidMount() {
    this.loadRequests()
    this.loadRequestsByUser(localStorage.user_id)
  }

  render() {

    return (
      <div>
        <section className={styles.heading}>

          <h1>Your Feature Requests: {this.state.requestsByUser.length}</h1>
          <h1>Total Feature Requests: {this.state.featureRequests.length}</h1>
        </section>

        <main className={styles.data}>
          <DataContainer
            label="Your FeatureRequests"
            content={this.state.requestsByUser}
          />
          <DataContainer
            label="Due this Week"
            content={this.state.dueThisWeek}
          />
          <DataContainer
            label="Following"
            emptyMessage="You are not following any feature requests"
            content={this.state.following}
          />
          <DataContainer
            label="All Requests"
            content={this.state.featureRequests}
          />
        </main>
      </div>
    )
  }
}
