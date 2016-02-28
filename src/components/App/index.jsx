import React from 'react'
import Header from '../Header'
import AddFeature from '../AddFeature'
import { Router, Route, hashHistory } from 'react-router'
import auth from '../../auth'

import styles from './styles.css'

export default class App extends React.Component {
  constructor () {
    super ()
    
    this.state = {
      loggedIn: auth.loggedIn()
    }
    
    this.updateAuth = this.updateAuth.bind(this)
  }
  
  updateAuth(loggedIn) {
    this.setState({loggedIn: loggedIn})
  }
  
  componentWillMount() {
    auth.onChange = this.updateAuth
    auth.login()
  }
  
  render() {
    return (
      <div>
      
        <Header />
        
        <div className={styles.contentContainer}>
          <main className={styles.content}>
          
            <AddFeature />
          </main>
        </div>
      </div>
    )
  }
}
