import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import Dropdown from '../lib/components/Dropdown';
import { unsetUser } from '../store/user';
import './Header.scss'

class Header extends Component {
  render () {
    return (
      <header className="header">
        <div className="header__logo">
          Talk To Me
          </div>
        <div className="header__actions">
          {this.props.username && (
            <Dropdown header={`Hello, ${this.props.username}`}>
              <li className="header__me">
                <a href='/chat/settings'>
                  Edit profile
                </a>
              </li>
              <li className='header__logout' onClick={this.props.logoutRequest}>
                <i className='fa fa-sign-out-alt' />
                Logout
            </li>
            </Dropdown>
          )}
        </div>
      </header>
    )
  }
}

const mapState = ({ user }) => ({
  username: user && user.username
});

const mapDispatch = dispatch => ({
  logout: () => dispatch(unsetUser())
});

export default connect(mapState, mapDispatch)(Header);
