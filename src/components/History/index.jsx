import React from 'react'
import * as _ from 'lodash'
import styles from './styles.css'
import Moment from 'moment';
import history from '../../data/history'
import users from '../../data/users'

export default class History extends React.Component {
  constructor(){
    super()
    this.state = {
      messages: [],
      addingNew: false,
      newMessage: '',
    }

    this.loadHistory = this.loadHistory.bind(this)
    this.toggleAddingNew = this.toggleAddingNew.bind(this)
    this.handleNewMessageKeyPress = this.handleNewMessageKeyPress.bind(this)
    this.addMessage = this.addMessage.bind(this)
  }

  loadHistory(requestId) {
    history.getHistoryById(requestId, (response) => {
      this.setState({messages: response.messages})
    })
  }

  toggleAddingNew() {
    this.setState({addingNew: !this.state.addingNew})
  }

  handleNewMessageKeyPress(event) {
    this.setState({newMessage: this._newMessageInput.innerText.trim()})
  }

  addMessage() {
    let messageBody = {
      id: this.props.requestId,
      type: 'message',
      authorId: localStorage.user_id,
      message: this.state.newMessage
    }

    if (this.state.newMessage.length >= 4) {

     this.toggleAddingNew()

      history.insertHistoryMessage(messageBody, () => {
        this.loadHistory(this.props.requestId)
      })
    } else {
      alert('Enter a Message or Cancel')
    }

  }

  componentDidMount() {
    this.loadHistory(this.props.requestId)
  }

  render() {

    //let messages = this.state.messages

    let messages = _.sortedUniq(this.state.messages).reverse()

    let content = messages.map((message) => {
      let key = (message.timestamp)
      let name = message.name.first + ' ' + message.name.last
      let creationDate = Moment(message.timestamp * 1000)
        .calendar(null, {
           sameDay: '[Today]',
           lastDay: '[Yesterday]',
           sameElse: 'MM/DD/YYYY'
        })

      return (
          <li key={key} className={styles.historyItem}>
            <section className={styles.historyHeader}>
              <h1 className={styles.historyAuthor}>{name}</h1>
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

        {this.state.addingNew &&

          <li className={styles.addMessage}>
            <div ref={(c) => this._newMessageInput = c}
              contentEditable="true"
              className={styles.newMessage}
              onKeyUp={this.handleNewMessageKeyPress}
            ></div>
          </li>
        }

        <li className={styles.menu}>

          {this.state.addingNew &&

            <a onClick={this.addMessage}
              className={styles.menuItem}
            >
              Add Message
            </a>
          }

          <a onClick={this.toggleAddingNew}
            className={styles.menuItem}
          >
            {this.state.addingNew ? 'Cancel' : 'New Message'}
          </a>
        </li>
        {content}
      </ul>
    )
  }
}