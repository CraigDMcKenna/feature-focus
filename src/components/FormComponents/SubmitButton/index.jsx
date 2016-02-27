import React from 'react'
import styles from './styles.css'
import * as stylesCommon from '../common.css'

export default class SubmitButton extends React.Component {
  render() {
    
    function setClassByState () {
      // set class depending on state
      // default, disabled...
    }
    
    return (
      <button type="submit" className={styles.button}>{this.props.buttonText}</button>
    )
  }
}
