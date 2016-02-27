import React from 'react'
import styles from './styles.css'
import * as stylesCommon from '../common.css'
import qMarkIcon from '../../../images/help-circle.png'

// Takes an array of unique values or objects with unique keys 
// and maps each to <select> children as <option>
// this.props.optionKey = unique Object.key ('string')
//   * maps to react key and option value
// this.props.OptionValue = Object.key ('string')
//   * maps to option child/children
//
// TODO: propTypes


export default class Select extends React.Component {
  render() {
    
    let placeHolder = this.props.placeHolder &&
      <option value="" disabled={this.props.disabledPlaceHolder}>
        {this.props.placeHolder}
      </option>
    
    let options = this.props.options.map(option => {
        let key,
            children;
 
        if (typeof(option) === 'object') {       
          key = option[this.props.optionKey]
          children = option[this.props.optionValue]
        } else {
          key = option
          children = option
        } 
        return (
            <option key={key} value={key}>
              {children}
            </option>
        )
    })    
    
    return (
      <div className={stylesCommon.container}>
        <label htmlFor={this.props.id} className={stylesCommon.label}>
          {this.props.label}
        </label>
       
        <div className={stylesCommon.inputContainer}
          style={this.props.disabled ? {backgroundColor: 'rgb(211, 211, 211)'} : {}}
        >
          <img src={this.props.icon} className={styles.icon} />
         
          <select
            id={this.props.id}
            className={styles.select}
            onChange={this.props.onChange}
            disabled={this.props.disabled}
          >
            {placeHolder}          
            {options}
          </select>
        </div>
      </div>
    )
  }
}
