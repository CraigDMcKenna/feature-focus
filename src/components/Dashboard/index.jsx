import * as _ from 'lodash'
import React from 'react'
import DataContainer from '../DataContainer'
import Moment from 'moment'
import clients from '../../data/clients'
import products from '../../data/products'
import featureRequests from '../../data/feature-requests'
import users from '../../data/users'
import styles from './styles.css'

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      featureRequests: [],
      requestsByUser: [],
      dueThisWeek: [],
      following: [],
    }

    this.loadRequests = this.loadRequests.bind(this)
    this.loadRequestsByUser = this.loadRequestsByUser.bind(this)
    this.loadFollowing = this.loadFollowing.bind(this)
    this.sortRequests =  this.sortRequests.bind(this)
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

  loadFollowing() {
    users.userAllFollowing(localStorage.user_id, (response) => {
      this.setState({following: response})
    })
  }

  sortRequests(stateObj, by) {
    let sortedRequests = _.sortBy(this.state[stateObj], (o) => o[by])
    console.log(sortedRequests)

    this.setState({[stateObj]: sortedRequests})
  }


  componentDidMount() {
    this.loadRequests()
    this.loadRequestsByUser(localStorage.user_id)
    this.loadFollowing()
  }

  render() {

    return (
      <div>
        <section className={styles.header}>

          <h1 className={styles.heading}>Your Feature Requests: {this.state.requestsByUser.length}</h1>
          <h1 className={styles.heading}>Total Feature Requests: {this.state.featureRequests.length}</h1>
        </section>

        <main className={styles.data}>

          <DataContainer
            label="Your Feature Requests"
            emptyMessage="You are not he owner of any feature requests"
            content={this.state.requestsByUser}
            sortDate={() => this.sortRequests('requestsByUser', 'targetDate')}
            sortClient={() => this.sortRequests('requestsByUser', 'name')}
          />

          <DataContainer
            label="Due this Week / Overdue"
            emptyMessage="There are no feature requests due this week"
            content={this.state.dueThisWeek}
            sortDate={() => this.sortRequests('dueThisWeel', 'targetDate')}
            sortClient={() => this.sortRequests('dueThisWeek', 'name')}
          />

          <DataContainer
            label="Following"
            emptyMessage="You are not following any feature requests"
            content={this.state.following}
            sortDate={() => this.sortRequests('following', 'targetDate')}
            sortClient={() => this.sortRequests('following', 'name')}
          />

          <DataContainer
            label="All Requests"
            emptyMessage="There are no active feature requests"
            content={this.state.featureRequests}
            sortDate={() => this.sortRequests('featureRequests', 'targetDate')}
            sortClient={() => this.sortRequests('featureRequests', 'name')}
          />
        </main>
      </div>
    )
  }
}
