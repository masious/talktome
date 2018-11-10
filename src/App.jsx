import React, { Component } from 'react';
import Toast, { NotifyContext } from './lib/components/Toast';
import Routes from './routes';

import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: true,
    };
  }

  componentDidMount() {
    window.onfocus = () => {
      this.setState({
        isFocused: true,
      });
    };
    window.onblur = () => {
      this.setState({
        isFocused: false,
      });
    };

    if (!('Notification' in window)) {
      return;
    }

    Notification.requestPermission();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { isFocused } = this.state;
    if (nextState.isFocused !== isFocused) {
      return false;
    }
    return true;
  }

  setToastRef = (ref) => {
    this.toastRef = ref;
  }

  notify = (message) => {
    const { isFocused } = this.state;
    if (isFocused) {
      this.toastRef.showMessage(message);
      return;
    }

    if (!('Notification' in window)) {
      this.toastRef.showMessage(message);
    } else if (Notification.permission === 'granted') {
      new Notification(message);
    } else if (Notification.permission !== 'denied') {
      new Notification(message);
    }
  }

  render() {
    return (
      <div className="container" id="container">
        <NotifyContext.Provider value={{ notify: this.notify }}>
          <Routes />
        </NotifyContext.Provider>
        <Toast onRef={this.setToastRef} />
      </div>
    );
  }
}

export default App;
