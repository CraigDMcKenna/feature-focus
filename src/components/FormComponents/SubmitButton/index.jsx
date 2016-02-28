import React from 'react'
import styles from './styles.css'
import * as stylesCommon from '../common.css'

export default class SubmitButton extends React.Component {
  render() {
    let buttonClass = this.props.disabled ?
      styles.buttonDisabled :
      styles.button
     
    return (
      <button
        type="submit" className={buttonClass}
        disabled={this.props.disabled} 
      >
        {this.props.buttonText}
      </button>
    )
  }
}
