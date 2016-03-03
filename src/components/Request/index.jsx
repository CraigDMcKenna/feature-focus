import React from 'react'
import styles from './styles.css'
import Moment from 'moment';
import featureRequests from '../../data/feature-requests'

export default class Request extends React.Component {
  constructor(){
    super()

    this.state = {
      request: {
        title: '',
        priority: '',
        createdByName: {name: {first: '', last: ''}},
        targetDate: '',
        clientName: {name: ''},
        productName: {productName: ''},
        ticketUrl: '',
        description: '',
      },
      owner: '',
      targetDate: '',
      createdDate: ''
    }

    this.loadRequest = this.loadRequest.bind(this),
    this.formatData = this.formatData.bind(this)
  }

  loadRequest(id) {
    featureRequests.getRequestById(id, (response) => {
      this.setState({request: response})
      this.formatData(response)
    })
  }

  formatData (request) {
    let targetDate = Moment(request.targetDate).format('dddd, MMM Do, YYYY')
    let createdDate = Moment(request.createdOn)
    .calendar(null, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY'
})

    this.setState ({
      owner: request.ownerName ?
      request.ownerName.first + ' ' + request.ownerName.last :
      request.createdByName.name.first + ' ' + request.createdByName.name.last
    })
    this.setState({targetDate: targetDate})
    this.setState({createdDate: createdDate})
  }

  componentDidMount() {
    this.loadRequest(this.props.params.id)
  }

  render() {
    return (
      <div>
        <section className={styles.headerRow}>
          <div className={styles.titleContainer}>
            <div className={styles.notFollowing}></div>
            <h1 className={styles.title}>{this.state.request.title}</h1>
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
                {this.state.owner}
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
          <ul className={styles.requestLabels}>
            <li className={styles.requestLabelsItem}>
              Target Date
            </li>
            <li className={styles.requestLabelsItem}>
              Client
            </li>
            <li className={styles.requestLabelsItem}>
              Ticket URL
            </li>
            <li className={styles.requestLabelsItem}>
              Product Area
            </li>
            <li className={styles.requestLabelsItem}>
              description
            </li>

          </ul>
          <ul className={styles.requestItems}>
            <li className={styles.requestItemsItem}>
              {this.state.targetDate}
            </li>
            <li className={styles.requestItemsItem}>
              {this.state.request.clientName.name}
            </li>
            <li className={styles.requestItemsItem}>
              {this.state.request.ticketUrl}
            </li>
            <li className={styles.requestItemsItem}>
              {this.state.request.productName.productName}
            </li>
            <li className={styles.requestItemsItem}>
              {this.state.request.description}
            </li>
          </ul>
          <ul className={styles.historyContainer}>
            <li className={styles.historyItem}>
              <h1 className={styles.historyDate}>{this.state.createdDate}</h1>
              Feature request created
              by {this.state.owner}
            </li>
          </ul>

        </section>
      </div>
    )
  }
}
