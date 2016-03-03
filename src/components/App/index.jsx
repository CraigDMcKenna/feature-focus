import React from 'react'
import Header from '../Header'
import DropDownMenu from '../DropDownMenu'
import styles from './styles.css'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header location={this.props.location.pathname}>
          <DropDownMenu />
        </Header>

        <div className={styles.contentContainer}>
          <main className={styles.content}>

            {this.props.children}
          </main>
        </div>
      </div>
    )
  }
}
