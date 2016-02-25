import React from 'react'
import ReactDom from 'react-dom'
import App from './components/App'

import styles from './styles-common/layout.css'

const appSection = document.createElement('div')

appSection.id = 'root'

document.body.insertBefore(appSection, document.body.firstChild);

ReactDom.render(<App />, appSection)
