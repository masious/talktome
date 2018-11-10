import React, { Component } from 'react';
import { connect } from 'react-redux';
import TabMenu from '../lib/components/TabMenu';
import Signup from '../containers/Signup';
import Login from '../containers/Login';
import screenshot from '../shot.png';

import './Home.scss';

class Home extends Component {
  componentDidMount() {
    this.checkRedirection(this.props.isLoggedIn);
  }

  componentWillReceiveProps(nextProps) {
    this.checkRedirection(nextProps.isLoggedIn);
  }

  checkRedirection(username) {
    if (username) {
      this.props.history.push('/chat');
    }
  }

  render() {
    return (
      <div className="app__home">
        <div className="home__intro">
          <div className="intro__title">
            Talk To Me
          </div>
          <div className="intro__message">
            A fully functional messaging website
            <p>
              Built only for having a demo of what I can do.
              <br />
              Checkout sources for&nbsp;
              <a href="https://github.com/masious/talktome">
                frontend
              </a>
              &nbsp; and&nbsp;
              <a href="https://github.com/masious/talktome">
                backend
              </a>
              &nbsp;, or checkout my&nbsp;
              <a href="https://docs.google.com/document/d/1AxtNumm1b9W73JrVBaeVrgjtxjapezu5OfCiDd7r2SA/edit?usp=sharing">
                resume
              </a>
.
            </p>
          </div>
          <div className="home__actions">
            <div className="app__forms">
              <TabMenu
                data={[{
                  title: 'Signup',
                  body: () => <Signup setUser={this.setMe} />,
                  isActive: true,
                }, {
                  title: 'Login',
                  body: () => <Login setUser={this.setMe} />,
                }]}
              />
            </div>
          </div>
        </div>
        <div className="home__second">
          <div className="screenshot">
            <div className="screenshot__img-wrapper">
              <img
                alt="How talk to looks like in a desktop."
                src={screenshot}
                className="screenshot__img"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = ({ user }) => ({
  isLoggedIn: Boolean(user && user.username),
});

export default connect(mapState)(Home);
