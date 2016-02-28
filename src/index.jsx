import React from 'react'
import ReactDom from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import App from './components/App'
import Login from './components/Login'
import styles from './styles-common/layout.css'
import auth from './auth'

const appSection = document.createElement('div')

appSection.id = 'root'

document.body.insertBefore(appSection, document.body.firstChild);

function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

ReactDom.render((
  <Router history={hashHistory}>
    <Route path="/" component={App} onEnter={requireAuth}/>
    <Route path="/login" component={Login} />
  </Router>
), appSection)
