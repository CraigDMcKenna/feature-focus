import React from 'react'
import LoadingModal from '../LoadingModal'
import styles from './styles.css'
import Moment from 'moment';
import featureRequests from '../../data/feature-requests'
import users from '../../data/users'

export default class Request extends React.Component {
  constructor(){
    super()

    this.state = {
      request: {
        creationDate: '',
        title: '',
        priority: '',
        createdBy: '',
        createdByName: {name: {first: '', last: ''}},
        owner: '',
        ownerName: {name: {first: '', last: ''}},
        targetDate: '',
        clientName: {name: ''},
        productName: {productName: ''},
        ticketUrl: '',
        description: '',
      },
      following: false,
      loading: true
    }

    this.loadRequest = this.loadRequest.bind(this),
    this.loadIsFollowing = this.loadIsFollowing.bind(this)
    this.toggleFollowing = this.toggleFollowing.bind(this)
  }

  loadRequest(id) {
    featureRequests.getRequestById(id, (response) => {
      this.setState({request: response})
    })
  }

  loadIsFollowing() {
    users.userIsFollowing(this.props.params.id, (response) => {
      this.setState({following: response.following})
      this.setState({loading: false})
    })
  }

  toggleFollowing() {
    this.setState({following: !this.state.following})
  }

  formatData (request) {
    let createdDate = Moment(request.createdOn)
    .calendar(null, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY'
})
    this.setState({createdDate: createdDate})
  }

  componentDidMount() {
    this.loadRequest(this.props.params.id)
    this.loadIsFollowing()
  }

  render() {
    let userName = localStorage.user_firstname + ' ' + localStorage.user_lastname
    let ownerName = this.state.request.ownerName.name.first +
      ' ' + this.state.request.ownerName.name.last

    let displayFollowIcon = ownerName !== userName // use to hide from owner
    let collapseTitleMargin = !displayFollowIcon ?
      { marginLeft: '0' } :
      {}

    let targetDate = Moment(this.state.request.targetDate).format('dddd, MMM Do, YYYY')
    let followingClass = this.state.following ? styles.following : styles.notFollowing
    let creationDate = Moment(this.state.request.creationDate)
      .calendar(null, {
        sameDay: '[Today]',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] ddd'
      })

    let createdBy = this.state.request.createdByName.name.first +
      ' ' + this.state.request.createdByName.name.last

    return (
      <div>
        {this.state.loading &&
          <LoadingModal />
        }
        <section className={styles.headerRow}>
          <div className={styles.titleContainer}>

          {/* hide follow icon from owner of feature request */}
          {displayFollowIcon &&
            <div
            className={followingClass}
            onClick={this.toggleFollowing}
            >
            </div>
          }
            <h1
              className={styles.title}
              style={collapseTitleMargin}
            >
              {this.state.request.title}
            </h1>
            <h1 className={styles.priority}>
              Priority:
              <span className={styles.priorityNumber}>
                {this.state.request.priority}
              </span>
            </h1>
          </div>

          <div className={styles.ownerContainer}>
              <p className={styles.ownerText}>
                owner:
                <br />
                {ownerName}
                <br />
                <a href="#" className={styles.link}>change</a>
              </p>
              <img
                className={styles.ownerImage}
                src="https://avatars3.githubusercontent.com/u/13183831?v=3&s=460"
              />

          </div>
        </section>

        <section  className={styles.requestBody}>
          <ul className={styles.requestItems}>
            <li className={styles.requestItemContainer}>

              <h2 className={styles.requestItemLabel}>Target Date</h2>

              <div className={styles.requestItem}>
                {targetDate}
              </div>
            </li>

            <li className={styles.requestItemContainer}>
              <h2 className={styles.requestItemLabel}>Client</h2>

              <div className={styles.requestItem}>
                {this.state.request.clientName.name}
              </div>
            </li>

            <li className={styles.requestItemContainer}>
              <h2 className={styles.requestItemLabel}>Ticket URL</h2>

              <div className={styles.requestUrl}>
                <a href={this.state.request.ticketUrl}
                   className={styles.link}
                   target="_blank"
                 >
                  {this.state.request.ticketUrl}
                </a>
              </div>
            </li>

            <li className={styles.requestItemContainer}>
              <h2 className={styles.requestItemLabel}>Product Area</h2>

              <div className={styles.requestItem}>
                {this.state.request.productName.productName}
              </div>
            </li>

            <li className={styles.requestItemContainer}>
              <h2 className={styles.requestItemLabel}>Description</h2>

              <div className={styles.requestDescription}>
                {this.state.request.description}
              </div>
            </li>

          </ul>
          <ul className={styles.historyContainer}>



            <li className={styles.historyItem}>
              <section className={styles.historyHeader}>
                <h1 className={styles.historyHeading}>{creationDate}</h1>
                <h1 className={styles.historyAuthor}>{createdBy}</h1>
              </section>
              <section className={styles.historyBody}>
                Created Feature Request
              </section>
            </li>
          </ul>

        </section>
      </div>
    )
  }
}
