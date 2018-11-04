import React, { Component } from 'react';
import classnames from 'classnames';
import user from '../user.png';
import TimeAgo from '../lib/components/TimeAgo';

export default class Contact extends Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.onClick(this.props.contact)
  }
  
  render () {
    const {
      contact,
      isActive
    } = this.props

    return (
      <li
        onClick={this.handleClick}
        className={classnames(
          'contacts__contact',
          isActive && 'contact--active'
        )}>
        <div className='contact__avatar'>
          <div className='avatar__img-wrapper'>
            <img
              src={contact.photoUrl || user}
              alt='user avatar'
              className='avatar__img' />
          </div>
          {!!contact.unreadCount && (
            <div className='contact__badge'>
              {contact.unreadCount}
            </div>
          )}
        </div>
        <div className='contact__info'>
          <div className='contact__username'>
            {contact.username}
          </div>
          {contact.lastMessage && (
            <div className='contact__message'>
              <div className='contact__body'>
                {contact.lastMessage.body}
              </div>
              <TimeAgo className='contact__time'>
                {contact.lastMessage.receivedAt}
              </TimeAgo>&nbsp;ago
                  </div>
          )}
        </div>
      </li>
    )
  }
}