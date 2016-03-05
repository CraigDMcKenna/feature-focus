import * as _ from 'lodash'
import React from 'react'
import styles from './styles.css'
import Moment from 'moment';
import history from '../../data/history'
import users from '../../data/users'

export default class History extends React.Component {
  constructor(){
    super()
    this.state = {
      history: []
    }

    this.loadHistory = this.loadHistory.bind(this)
  }

  loadHistory(requestId) {
    history.getHistoryById(requestId, (response) => {
      let responseArray = _.toPairs(response)
      this.setState({history: responseArray})
    })
  }

  componentDidMount() {
    this.loadHistory(this.props.requestId)
  }

  render() {
    let content = this.state.history.map((messageArr) => {
      let message = messageArr[1]
      let key = (messageArr[0])
      let creationDate = Moment(message.timestamp * 1000)
        .calendar(null, {
           sameDay: '[Today]',
           lastDay: '[Yesterday]',
           sameElse: 'MM/DD/YYYY'
        })

      return (
          <li key={key} className={styles.historyItem}>
            <section className={styles.historyHeader}>
              <h1 className={styles.historyAuthor}>{message.authorId}</h1>
              <h1 className={styles.historyDate}>{creationDate}</h1>
            </section>
            <section className={styles.historyBody}>
              {message.message}
            </section>
          </li>
      )
    })

     return (
      <ul className={styles.historyContainer}>
        {content}
      </ul>
    )
  }
}