import React from 'react'
import * as _ from 'lodash'
import LoadingModal from '../LoadingModal'
import History from '../History'
import ContentEditable from 'react-contenteditable'
import styles from './styles.css'
import Moment from 'moment';
import featureRequests from '../../data/feature-requests'
import users from '../../data/users'
import history from '../../data/history'

export default class Request extends React.Component {
  constructor() {
    super()

    this.state = {
      request: {
        id: '',
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
      loading: true,
      titleEdit: false,
      title: '',
      descriptionEdit: false,
      description: ''
    }

    this.loadRequest = this.loadRequest.bind(this),
    this.toggleFollowing = this.toggleFollowing.bind(this)
    this.editItem = this.editItem.bind(this)
    this.cancelEditItem = this.cancelEditItem.bind(this)
    this.saveItem = this.saveItem.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
  }

  loadRequest(id) {
    featureRequests.getRequestById(id, (response) => {
      this.setState({request: response})
      this.setState({title: response.title})
      this.setState({description: response.description})

      users.userIsFollowing(this.props.params.id, (response) => {
        this.setState({following: response.following})
        this.setState({loading: false})
      })
    })
  }

  toggleFollowing() {
    this.setState({following: !this.state.following})
  }
  //this is ugly!!!!!!!
  handleContentChange(stateObjKey, event) {
    let str = event.target.value

    _.templateSettings.interpolate = /<(...)>/g;
    let compile = _.template(str)
    let compiled = compile({'div' : '\n'})

    this.setState({ [stateObjKey] : compiled.replace(/\u00a0/g, ' ').replace(/(<([^>]+)>)/ig, '').trim() })
  }

  editItem(stateObjKey, event) {
    let target = event.target

    this.setState({[stateObjKey] : true})

    setTimeout(() => {
      target.focus()
    }, 200)
  }

  // set editing state to false
  // revert to inital value (this.state.request[key])
  cancelEditItem(stateEditKey, stateValueKey) {
   this.setState({[stateEditKey] : false})
   this.setState({[stateValueKey] : this.state.request[stateValueKey]})
  }

  saveItem(stateEditKey, stateValueKey) {
    let update = {
      id: this.state.request.id,
      updateItem: stateValueKey,
      value: this.state[stateValueKey]
    }
    this.setState({loading: true})

    featureRequests.updateRequest(update, (response) => {
      if (response.length) {
        let message = 'Updated ' + stateValueKey +
          ' from: ' + this.state.request[stateValueKey]

        let messageBody = {
          id: this.state.request.id,
          type: 'update',
          authorId: localStorage.user_id,
          message: message
        }

        let requestObject = this.state.request

        requestObject[stateValueKey] = response[0].new_val[stateValueKey]

        this.setState({[stateValueKey]: response[0].new_val[stateValueKey]})
        this.setState({request: requestObject})
        this.setState({[stateEditKey] : false})

        history.insertHistoryMessage(messageBody, () => {
          this.setState({loading: false})
        })
      } else {
        this.setState({loading: false})
        this.setState({[stateEditKey] : false})
      }
    })
  }

  componentDidMount() {
    this.loadRequest(this.props.params.id)
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

    let titleEditButtonsClass = this.state.titleEdit ?
      styles.editButtonsShow : styles.editButtons

    let descriptionEditButtonsClass = this.state.descriptionEdit ?
      styles.editButtonsShow : styles.editButtons

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

          <ContentEditable
            name="title"
            html={this.state.title}
            disabled={!this.state.titleEdit}
            onChange={this.handleContentEditableChange}
            className={styles.title}
            style={collapseTitleMargin}
            onClick={(event) => this.editItem('titleEdit', event)}
            onChange={(event) => this.handleContentChange('title', event)}
          />
          <div ref="titleEditButtons" className={titleEditButtonsClass}>
            <div
              className={styles.editButton}
              onClick={() => this.saveItem('titleEdit', 'title')}
            >
              save
            </div>
            <div
              className={styles.editButton}
              onClick={() => this.cancelEditItem('titleEdit', 'title')}
            >
              cancel
            </div>
          </div>


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

              <ContentEditable
                name="description"
                html={this.state.description}
                disabled={!this.state.descriptionEdit}
                onChange={this.handleContentEditableChange}
                className={styles.requestDescription}
                onClick={(event) => this.editItem('descriptionEdit', event)}
                onChange={(event) => this.handleContentChange('description', event)}
              />
              <div ref="descriptionEditButtons" className={descriptionEditButtonsClass}>
                <div
                  className={styles.editButton}
                  onClick={() => this.saveItem('descriptionEdit', 'description')}
                >
                  save
                </div>
                <div
                  className={styles.editButton}
                  onClick={() => this.cancelEditItem('descriptionEdit', 'description')}
                >
                  cancel
                </div>
              </div>
            </li>
          </ul>

          <History requestId={this.props.params.id} />
        </section>
      </div>
    )
  }
}
