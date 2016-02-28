import React from 'react'
import TextInput from '../FormComponents/TextInput'
import SubmitButton from '../FormComponents/SubmitButton'
import styles from './styles.css'

export default class Modal extends React.Component {
  
  render() {
    let isActive = this.props.isActive
    let htmlStyle = document.documentElement.style
    let overlayClass = isActive ? styles.overlayActive : styles.overlayInactive
    
    htmlStyle.overflow = isActive ? 'hidden' : 'initial'
    //htmlStyle.height = isActive ? '100vh' : 'initial'
    
    return (
      <div className={overlayClass}>
        <div className={styles.modal}>
          {this.props.content}
          <form>
            <TextInput />
            <TextInput />
            <SubmitButton />
          </form>
        </div>
      </div>
    )
  }
}
