import React from 'react'
import styles from './styles.css'
import Moment from 'moment'
import { Router, Route, Link } from 'react-router'



export default class DataContainer extends React.Component {
  constructor() {
    super()

    this.state = {
      loading: true
    }

  }

  render() {
    let content = this.props.content.length === 0 || undefined ?
      <tr className={styles.listItem}><td>{this.props.emptyMessage}</td></tr>
      :
      this.props.content.map((request, index) => {
        let key = request.id
        let listClass = index % 2 ? styles.listItemEven : styles.listItemOdd
        let date = Moment(request.targetDate).format('M/D')
        let link = `/request/${request.id}`
        return (

            <tr key={key} className={listClass}>
              <td className={styles.itemDate}>
                <Link to={link} className={styles.link}>
                  {date}
                </Link>
              </td>
              <td className={styles.itemTitle}>
                <Link to={link} className={styles.link}>
                  {request.title}
                </Link>
              </td>
              <td className={styles.itemClient}>
                <Link to={link} className={styles.link}>
                  {request.name}
                </Link>
              </td>

            </tr>

        )
    })


    return (
      <div className={styles.wrapper}>
        <h1 className={styles.heading}>
          {this.props.label}
        </h1>

        <div className={styles.container}>
          <div className={styles.menuBar}></div>
            <div className={styles.tableWrapper}>
              <table className={styles.data}>
                <tbody>
                  {content}
                </tbody>
              </table>
            </div>
        </div>
     </div>
    )
  }
}
