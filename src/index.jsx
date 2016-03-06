import React from 'react'
import ReactDom from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import App from './components/App'
import Request from './components/Request'
import Login from './components/Login'
import Logout from './components/Logout'
import Dashbord from './components/Dashboard'
import AddFeature from './components/AddFeature'
import styles from './styles-common/layout.css'
import auth from './auth'

const appSection = document.createElement('div')

appSection.id = 'root'

document.body.insertBefore(appSection, document.body.firstChild);

function requireAuth(nextState, replace) {
  if (!auth.loggedIn() || !auth.activeUser()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

ReactDom.render((
  <Router history={hashHistory}>
    <Route path="/" component={App} onEnter={requireAuth}>
      <IndexRoute component={Dashbord} />
      <Route path="request/:id" component={Request} />
      <Route path="new-request" component={AddFeature} />
      <Route path="/logout" component={Logout} />
    </Route>

    <Route path="/login" component={Login} />
  </Router>
), appSection)
