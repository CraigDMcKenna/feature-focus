import React from 'react'
import { Router, Route, Link } from 'react-router'
import styles from './styles.css'
import logo from '../../images/ff-logo.png'

export default class Header extends React.Component {
  render() {
    return (
      <div>
        <header className={styles.header}>
          <nav className={styles.navBar}>
            <section className={styles.logoSection}>
              <img src={logo} className={styles.logo} />
              Feature Focus
            </section>
            <section className={styles.nav}>
              <Link to="/" className={styles.link}>
                Home
              </Link>
              <Link to="new-request" className={styles.link}>
                New
              </Link>
            </section>
          </nav>
        </header>
        {this.props.children}
      </div>
    )
  }
}
