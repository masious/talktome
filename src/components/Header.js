import React, { Component } from 'react';
import Dropdown from '../lib/components/Dropdown';

import './Header.scss'

export default class Header extends Component {
  render () {
    return (
      <header className="header">
        <div className="header__logo">
          Talk To Me
          </div>
        <div className="header__actions">
          {this.props.me && (
            <Dropdown header={`Hello, ${this.props.me.data.username}`}>
              <li className="header__me" onClick={this.props.settingsRequest}>
                Edit profile
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