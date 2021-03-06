import React from 'react'
import styles from './styles.css'
import * as stylesCommon from '../common.css'

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

    let inputContainerClass = this.props.disabled || this.props.loading ?
      stylesCommon.inputContainerDisabled :
      stylesCommon.inputContainer

    let iconClass = this.props.loading ?
      stylesCommon.iconLoading :
      stylesCommon.icon

    return (
      <div className={stylesCommon.container}>
        <label htmlFor={this.props.id} className={stylesCommon.label}>
          {this.props.label}
        </label>

        <div className={inputContainerClass}>
          <div className={iconClass}>&nbsp;</div>

          <select
            ref="selectElement"
            id={this.props.id}
            className={styles.select}
            onChange={this.props.onChange}
            disabled={this.props.disabled || this.props.loading}
          >
            {placeHolder}
            {options}
          </select>
        </div>
      </div>
    )
  }
}
