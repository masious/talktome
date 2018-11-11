import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import user from '../user.png';

import './Main.scss';
import TimeAgo from '../lib/components/TimeAgo';

function SelectAUser() {
  return (
    <div className="main__please-select">
      Select a contact to start chatting.
      <br />
      Feel free to message anyone :)
    </div>
  );
}

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      draftMessage: '',
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.setLastMessageRef = this.setLastMessageRef.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { other, me, markSeen } = this.props;

    if (!other || !other.messages) {
      return;
    }

    const prevMessagesLength = prevProps.other
      && prevProps.other.messages
      && prevProps.other.messages.length;

    const messagesLength = other
      && other.messages
      && other.messages.length;

    if ((!prevMessagesLength && messagesLength)
      || (prevMessagesLength < messagesLength)) {
      this.scrollToLastMessage();
    }

    other.messages
      .filter(message => message.receiver === me._id)
      .filter(message => !message.isSeen)
      .forEach(message => markSeen(other._id, message._id));
  }


  setLastMessageRef(ref) {
    this.lastMessageRef = ref;

    this.scrollToLastMessage();
  }

  scrollToLastMessage() {
    setTimeout(() => {
      if (!this.lastMessageRef) {
        return;
      }

      this.lastMessageRef.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  handleSendMessage(event) {
    if (event.keyCode === 13
      && event.shiftKey === false
      && event.target.value.length > 0) {
      this.sendMessage();
    }
  }

  handleMessageChange({ target }) {
    if (target.value === '\n') {
      this.setState({
        draftMessage: '',
      });
    } else {
      this.setState({
        draftMessage: target.value,
      });
    }
  }

  sendMessage() {
    const { draftMessage } = this.state;
    const { me, other, sendMessage } = this.props;

    this.setState(({
      draftMessage: '',
    }));

    const newMessage = {
      _id: Math.floor(Math.random() * 1000),
      body: draftMessage.trim(),
      sender: me._id,
      receiver: other._id,
      isPending: true,
    };

    sendMessage(newMessage);
  }

  render() {
    const {
      other,
      me,
    } = this.props;

    if (!other || !other.username) {
      return (
        <div className="app__main">
          <SelectAUser />
        </div>
      );
    }

    const {
      username,
      photoUrl,
      lastSeen,
      messages,
    } = other;

    const { draftMessage } = this.state;

    const myAvatar = me.photoUrl;
    const otherAvatar = photoUrl || user;

    const isOnline = (new Date().getTime() - new Date(lastSeen).getTime()) < 15 * 1000;

    return (
      <div className="app__main">
        {!other && (
          <SelectAUser />
        )}
        {other && (
          <Fragment>
            <header className="main__header">
              <div className="main__username">
                {username}
              </div>
              <div className="main__last-seen">
                {isOnline
                  ? 'Online'
                  : (
                    <span>
                      Last Seen:&nbsp;
                      <TimeAgo>
                        {lastSeen}
                      </TimeAgo>
                      &nbsp;ago
                    </span>
                  )}
              </div>
            </header>
            <main className="main__chat">
              <div className="chat__messages">
                {messages
                  && messages.map((message, index) => (
                    <div
                      key={`${message._id}`}
                      ref={messages.length - 1 === index && this.setLastMessageRef}
                      className={classnames(
                        'message',
                        (message.sender === me._id)
                          ? 'message--me'
                          : 'message--other',
                      )}
                    >
                      <div className="message__avatar">
                        <img
                          alt=""
                          src={(message.sender === me._id
                            ? myAvatar
                            : otherAvatar
                          ) || user}
                        />
                      </div>
                      <div className="message__body">
                        {message.body}
                        <i className={classnames(
                          message.sender === me._id
                          && message.isSeen
                          && 'fa fa-check-double',
                          message.isPending && 'far fa-clock',
                        )}
                        />
                      </div>
                      <div className="message__time">
                        {message.receivedAt ? (
                          <span>
                            <TimeAgo>
                              {message.receivedAt}
                            </TimeAgo>
                            &nbsp;ago
                          </span>
                        ) : 'Not sent yet'}
                      </div>
                    </div>
                  ))}
              </div>
            </main>
            <div className="main__compose">
              <div className="compose__button">
                <i className="fab fa-telegram-plane" onClick={this.sendMessage} />
              </div>
              <textarea
                value={draftMessage}
                onChange={this.handleMessageChange}
                onKeyDown={this.handleSendMessage}
                className="compose__input"
                placeholder="Write a message and hit enter..."
              />
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}
