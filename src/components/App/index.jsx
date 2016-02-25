import React from 'react'
import Header from '../Header'
import AddFeature from '../AddFeature'

import styles from './styles.css'

export default class App extends React.Component {
  render() {
    return (
      <div>
      
        <Header />
        
        <div className={styles.contentContainer}>
          <main className={styles.content}>
          
            <AddFeature />
          </main>
        </div>
      </div>
    )
  }
}
