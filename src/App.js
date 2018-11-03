import React, { Component, Fragment } from 'react';
import getUser from './utils/getUser';
import logoutUser from './utils/logoutUser';
import Header from './components/Header';
import TabMenu from './lib/components/TabMenu';
import Contacts from './components/Contacts';
import Signup from './containers/Signup';
import Login from './containers/Login';
import Toast from './lib/components/Toast';

import './styles/App.scss';
import Main from './containers/Main';
import SettingsModal from './components/SettingsModal';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      me: getUser(),
      isFocused: true,
      isSettingsOpen: false,
      other: null
    };

    this.setMe = this.setMe.bind(this);
    this.notify = this.notify.bind(this);
    this.setOther = this.setOther.bind(this);
    this.setToastRef = this.setToastRef.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.openSettings = this.openSettings.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
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

  openSettings () {
    this.setState({
      isSettingsOpen: true
    })
  }

  closeSettings () {
    this.setState({
      isSettingsOpen: false
    })
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

  setMe (me) {
    this.setState({ me });
  }

  setOther (other) {
    this.setState({ other });
  }

  logoutUser () {
    logoutUser();
    this.setState({
      me: null
    });
  }

  render () {
    const { me, other } = this.state

    return (
      <div className="container" id='container'>
        <Header
          other={other}
          me={me}
          settingsRequest={this.openSettings}
          logoutRequest={me && this.logoutUser} />
        <div className="app">
          {!me && (
            <div className="app__forms">
              <TabMenu
                data={[{
                  title: 'Signup',
                  body: () => <Signup setUser={this.setMe} />,
                  isActive: true
                }, {
                  title: 'Login',
                  body: () => <Login setUser={this.setMe} />
                }]} />
            </div>
          )}
          {me && (
            <Fragment>
              <Contacts
                setOther={this.setOther}
                me={me}
                notify={this.notify}
                active={other} />
              <Main
                me={me}
                other={other} />
              <SettingsModal
                notify={this.notify}
                isOpen={this.state.isSettingsOpen}
                handleClose={this.closeSettings}
                me={me} />
            </Fragment>
          )}
        </div>
        <Toast onRef={this.setToastRef} />
      </div >
    );
  }
}

export default App;
