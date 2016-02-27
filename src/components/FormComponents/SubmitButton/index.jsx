import React from 'react'
import styles from './styles.css'
import * as stylesCommon from '../common.css'

export default class SubmitButton extends React.Component {
  render() {
    let activeStateStyle = this.props.disabled ? {
      backgroundColor: 'rgb(211, 211, 211)',
      cursor: 'text'
    } : {}
     
    return (
      <button
        type="submit" className={styles.button}
        style={activeStateStyle}
        disabled={this.props.disabled} 
      >
        {this.props.buttonText}
      </button>
    )
  }
}
