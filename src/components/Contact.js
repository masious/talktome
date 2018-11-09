import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import user from '../user.png';
import TimeAgo from '../lib/components/TimeAgo';

export default class Contact extends Component {
  render () {
    const {
      contact,
      isActive
    } = this.props

    const lastMessage = contact.messages.length > 0
      && contact.messages[contact.messages.length - 1]

    return (
      <li
        className={classnames(
          'contacts__contact',
          isActive && 'contact--active'
        )}>
        <Link to={`/chat/${contact.username}`}>
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
            {lastMessage && (
              <div className='contact__message'>
                <div className='contact__body'>
                  {lastMessage.body}
                </div>
                <TimeAgo className='contact__time'>
                  {lastMessage.receivedAt}
                </TimeAgo>&nbsp;ago
                  </div>
            )}
          </div>
        </Link>
      </li>
    )
  }
}