// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from "react-redux"
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from "../components/App"
import store from "../redux/store"

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Router>
      <Provider store={store}>
        <Route path ="/" component={App}/>
      </Provider>
    </Router>,
    document.body.appendChild(document.createElement('div')),
  )
})
