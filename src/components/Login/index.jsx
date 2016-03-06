import auth from '../../auth'
import React from 'react'
import HeaderLogin from '../HeaderLogin'
import TextInput from '../FormComponents/TextInput'
import SubmitButton from '../FormComponents/SubmitButton'
import styles from './styles.css'

export default class Login extends React.Component {
  constructor(props, context) {
    super(props, context)

    context.router

    this.state = {
      error: false,
      email: '',
      password: ''
    }
  }

  handleChange(value, id) {
    let stateObject = this.state

    stateObject[id] = value
    this.setState(stateObject)
  }

  handleSubmit(event) {
    event.preventDefault()

    const email = this.state.email
    const pass = this.state.password

    auth.login(email, pass, (loggedIn) => {
      if (!loggedIn)
        return this.setState({ error: true })

      const { location } = this.props

      if (location.state && location.state.nextPathname) {
        this.context.router.replace(location.state.nextPathname)
      } else {
        this.context.router.replace('/')
      }
    })
  }

  render() {
    return (
      <div>
        <HeaderLogin />
        <div className={styles.login}>
          <h1 className={styles.heading}>Login</h1>

          {this.state.error && (
            <p className={styles.error}>
              Invalid username or password. Try again.
            </p>
          )}

          <form onSubmit={this.handleSubmit.bind(this)}>
            <TextInput
                type="email"
                id="email"
                label="Email"
                placeHolder="you@britecore.com"
                value={this.state.email}
                onChange={this.handleChange.bind(this)}
            />
            <TextInput
                type="password"
                id="password"
                label="Password"
                placeHolder="password"
                value={this.state.password}
                onChange={this.handleChange.bind(this)}
            />
            <SubmitButton
              buttonText="Login"
              disabled={this.state.submitDisabled}
            />
          </form>
        </div>
      </div>
    )
  }
}

Login.contextTypes = {
  router: React.PropTypes.object.isRequired
}
