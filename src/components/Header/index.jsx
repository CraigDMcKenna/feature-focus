import React from 'react'
import { Router, Route, Link } from 'react-router'
import styles from './styles.css'
import logo from '../../images/ff-logo.png'

export default class Header extends React.Component {
  constructor() {
    super()
  }
  render() {
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
              <li className={styles.user}>
              </li>
              <li className={styles.menu}>
              </li>

            </ul>
          </nav>
        </header>
        {this.props.children}
      </div>
    )
  }
}
