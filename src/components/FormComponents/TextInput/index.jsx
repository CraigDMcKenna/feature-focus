import React from 'react'
import styles from './styles.css'
import * as stylesCommon from '../common.css'
import qMarkIcon from '../../../images/help-circle.png'

export default class AddFeature extends React.Component {
  render() {
    return (
      <div className={stylesCommon.container}>
        <label htmlFor={this.props.id} className={stylesCommon.label}>
          {this.props.label}
        </label>
       
        <div className={stylesCommon.inputContainer}>
          <img src={qMarkIcon} className={styles.icon} />
          
          <input type={this.props.type} 
            id={this.props.id} 
              defaultValue={this.props.defaultValue} 
            className={styles.textInput}
          />
        </div>
     </div>
    )
  }
}
