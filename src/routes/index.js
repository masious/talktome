import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import Chat from './Chat';

export default class Routes extends Component {
  render () {
    return (
      <Router>
        <div className="app">
          <Route path='/' exact component={Home} />
          <Route path='/contacts' exact component={Chat} />
          <Route path='/chat/:username?' exact component={Chat} />
        </div>
      </Router>
    )
  }
}