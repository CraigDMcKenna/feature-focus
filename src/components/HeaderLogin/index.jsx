import React from 'react'
import styles from './styles.css'
import logo from '../../images/ff-logo.png'

export default class Header extends React.Component {
  render() {
    return (
      <header className={styles.header}>
        <nav className={styles.navBar}>
          <section className={styles.logoSection}>
            <img src={logo} className={styles.logo} />
            Feature Focus
          </section>
        </nav>
      </header>
    )
  }
}