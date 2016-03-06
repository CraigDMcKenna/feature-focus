import React from 'react'
import styles from './styles.css'
import logo from '../../images/ff-logo.png'

export default class DropDownMenu extends React.Component {
  render() {
    let headerClass = this.props.active ?
      styles.dropDownWrapperActive :
      styles.dropDownWrapper

    return (
      <div className={headerClass}>
        <section className={styles.dropDownNav}>
          {this.props.content}
        </section>
      </div>
    )
  }
}