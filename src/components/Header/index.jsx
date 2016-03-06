import React from 'react'
import { Router, Route, Link } from 'react-router'
import DropDownMenu from '../DropDownMenu'
import styles from './styles.css'
import logo from '../../images/ff-logo.png'

export default class Header extends React.Component {
  constructor() {
    super()

    this.state = {
      dropDownActive: false
    }

    this.toggleDropDown = this.toggleDropDown.bind(this)
  }

  toggleDropDown () {
    this.setState({dropDownActive: !this.state.dropDownActive})
  }


  render() {

    let dropDownContent =
      <div className={styles.dropDownContent}>
        <span className={styles.userInfo}>
          Logged in as {localStorage.user_firstname + ' ' + localStorage.user_lastname}
        </span>

        <Link to="/logout"
          className={styles.link}
        >
          Logout
        </Link>

        {this.props.location !== '/' &&
          <Link to="/" className={styles.linkNarrow}>
            Dashboard
          </Link>
        }

        {this.props.location !== '/new-request' &&
          <Link to="new-request" className={styles.linkNarrow}>
            New
          </Link>
        }

      </div>

    return (
      <div>
        <header className={styles.header}>

          <nav className={styles.navBar}>

            <section className={styles.logoSection}>
              <img src={logo} className={styles.logo} />
              Feature Focus
            </section>
            <ul className={styles.nav}>

              <li className={styles.navLi}>
                {this.props.location !== '/' &&
                  <Link to="/" className={styles.link}>
                    Dashboard
                  </Link>
                }
              </li>

              <li className={styles.navLi}>
                {this.props.location !== '/new-request' &&
                  <Link to="new-request" className={styles.link}>
                    New
                  </Link>
                }
              </li>

              <li
                className={styles.user}
                onClick={this.toggleDropDown}
              >
              </li>

              <li
                className={styles.menu}
                onClick={this.toggleDropDown}
              >
              </li>
            </ul>
          </nav>
        </header>

        <DropDownMenu
          active={this.state.dropDownActive}
          content={dropDownContent}
        />

        {this.props.children}
      </div>
    )
  }
}
