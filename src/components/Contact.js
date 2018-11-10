import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import user from '../user.png';
import TimeAgo from '../lib/components/TimeAgo';

export default class Contact extends Component {
  onClick = () => {
    const { onClick, contact } = this.props
    
    onClick(contact)
  }

  render () {
    const {
      contact,
      extra,
      isActive
    } = this.props

    const lastMessage = contact.messages
      && contact.messages.length > 0
      && contact.messages[contact.messages.length - 1]

    const secondary = extra || (lastMessage && {
      message: lastMessage.body,
      date: lastMessage.receivedAt
    });

    return (
      <li
        onClick={this.onClick}
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
          {secondary && (
            <div className='contact__message'>
              <div className='contact__body'>
                {secondary.message}
              </div>
              <TimeAgo className='contact__time'>
                {secondary.date}
              </TimeAgo>&nbsp;ago
                  </div>
          )}
        </div>
      </li>
    )
  }
}