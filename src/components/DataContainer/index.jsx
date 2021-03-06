import React from 'react'
import styles from './styles.css'
import Moment from 'moment'
import { Link } from 'react-router'

export default class DataContainer extends React.Component {

  render() {
    let content = this.props.content.length === 0 || undefined ?
      <tr className={styles.listItem}>
        <td className={styles.empty}>{this.props.emptyMessage}</td>
      </tr>
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
          <div className={styles.menuBar}>
            <ul className={styles.menuItems}>
              <li className={styles.sortLabel}>Sort By:</li>
              <li onClick={this.props.sortDate} className={styles.sort}>Target Date</li>
              <li onClick={this.props.sortClient} className={styles.sort}>Client</li>
            </ul>
          </div>
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
