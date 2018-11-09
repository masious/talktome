import React, { Component } from 'react';
import getUser from './utils/getUser';
import logoutUser from './utils/logoutUser';
import Header from './components/Header';
import Toast from './lib/components/Toast';
import Routes from './routes';

import './App.scss';
import './Home.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: true,
    };

    this.notify = this.notify.bind(this);
    this.setToastRef = this.setToastRef.bind(this);
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.isFocused !== this.state.isFocused) {
      return false
    }
    return true
  }

  componentDidMount () {
    window.onfocus = () => {
      this.setState({
        isFocused: true
      });
    };
    window.onblur = () => {
      this.setState({
        isFocused: false
      })
    }

    if (!('Notification' in window)) {
      return
    }

    Notification.requestPermission();
  }

  setToastRef (ref) {
    this.toastRef = ref
  }

  notify (message) {
    if (this.state.isFocused) {
      this.toastRef.showMessage(message);
      return
    }

    if (!('Notification' in window)) {
      return
    } else if (Notification.permission === 'granted') {
      new Notification(message);
    } else if (Notification.permission !== 'denied') {
      new Notification(message);
    }
  }

  render () {
    return (
      <div className="container" id='container'>
        <Header />
        <Routes />
        <Toast onRef={this.setToastRef} />
      </div >
    );
  }
}

export default App;
