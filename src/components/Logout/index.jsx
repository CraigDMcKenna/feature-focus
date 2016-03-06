import React from 'react'
import LoadingModal from '../LoadingModal'
import auth from '../../auth'

export default class Logout extends React.Component {
  constructor(props, context) {
    super(props, context)

    context.router
  }

  componentWillMount() {
    sessionStorage.clear()

    auth.logout(() => {
      const { location } = this.props

      if (location.state && location.state.nextPathname) {
        this.context.router.replace(location.state.nextPathname)
      } else {
        this.context.router.replace(`/login`)
      }
    })
  }

  render() {
    return (
      <LoadingModal />
    )
  }
}

Logout.contextTypes = {
  router: React.PropTypes.object.isRequired
}
