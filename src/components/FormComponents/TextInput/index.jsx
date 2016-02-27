import React from 'react'
import styles from './styles.css'
import * as stylesCommon from '../common.css'

export default class TextInput extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      value: this.props.value
    }
    
    this.handleChange = this.handleChange.bind(this)
  }
  
  handleChange(event) {
    this.setState({value: event.target.value})
    this.props.onChange(event.target.value)
  }
  
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
            value={this.state.value}
            onChange={this.handleChange}
          />
        </div>
     </div>
    )
  }
}
