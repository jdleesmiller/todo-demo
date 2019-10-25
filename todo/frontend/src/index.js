// Load polyfills
import 'whatwg-fetch'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// https://getbootstrap.com/docs/4.0/getting-started/webpack/#importing-compiled-css
import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './component/app'

ReactDOM.render(<App />, document.getElementById('app'))
