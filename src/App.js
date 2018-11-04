import React, { Component, Fragment } from 'react';
import getUser from './utils/getUser';
import logoutUser from './utils/logoutUser';
import Header from './components/Header';
import TabMenu from './lib/components/TabMenu';
import Contacts from './components/Contacts';
import Signup from './containers/Signup';
import Login from './containers/Login';
import Toast from './lib/components/Toast';
import Main from './containers/Main';
import SettingsModal from './components/SettingsModal';
import screenshot from './shot.png';

import './App.scss';
import './Home.scss';

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

    const previousHome = (
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
    );

    const newHome = (
      <div className='app__home'>
        <div className='home__intro'>
          <div className='intro__title'>
            Talk To Me
          </div>
          <div className='intro__message'>
            A fully functional messaging website
            <p>
              Built only for having a demo of what I can do.
            <br />
              Checkout sources for&nbsp;
            <a href='https://github.com/masious/talktome'>
                frontend
            </a>
              &nbsp; and&nbsp;
            <a href='https://github.com/masious/talktome'>
                backend
            </a>
              &nbsp;, or checkout my&nbsp;
            <a href='https://docs.google.com/document/d/1AxtNumm1b9W73JrVBaeVrgjtxjapezu5OfCiDd7r2SA/edit?usp=sharing'>
                resume
            </a>.
            </p>
          </div>
          <div className='home__actions'>
            {previousHome}
          </div>
        </div>
        <div className='home__second'>
          <div className='screenshot'>
            <div className='screenshot__img-wrapper'>
              <img
                alt='How talk to looks like in a desktop.'
                src={screenshot}
                className='screenshot__img' />
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="container" id='container'>
        <Header
          other={other}
          me={me}
          settingsRequest={this.openSettings}
          logoutRequest={me && this.logoutUser} />
        <div className="app">
          {!me && (
            newHome
          )}
          {me && (
            <Fragment>
              <Contacts
                setOther={this.setOther}
                other={other}
                me={me}
                notify={this.notify} />
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
