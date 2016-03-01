import React from 'react'
import styles from './styles.css'
import logo from '../../images/ff-logo.png'

export default class DropDownMenu extends React.Component {
  render() {
    return (
      <div className={styles.dropDownWrapper}>
        <section className={styles.dropDownNav}>
          <h1 className={styles.heading}>Heading{this.props.heading}</h1>
        </section>
      </div>
    )
  }
}