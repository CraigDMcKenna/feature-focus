import React from 'react'
import styles from './styles.css'
import * as stylesCommon from '../common.css'

export default class TextInput extends React.Component {
  render() {
    return (
      <div className={stylesCommon.container}>
        <label htmlFor={this.props.id} className={stylesCommon.label}>
          {this.props.label}
        </label>
       
        <div className={stylesCommon.inputContainer}>
          <div className={stylesCommon.icon}></div>
          
          <input type={this.props.type} 
            id={this.props.id} 
            placeholder={this.props.placeHolder} 
            className={styles.textInput}
            value={this.props.value}
          />
        </div>
     </div>
    )
  }
}
