import React from 'react'
import ReactDom from 'react-dom'
import App from './components/App'

//import Typography, {body} from './common-styles/typography.css'
//import './common-styles/layout.css'

const appSection = document.createElement('section')

appSection.className = 'app-section'

document.body.insertBefore(appSection, document.body.firstChild);

ReactDom.render(<App />, appSection)
