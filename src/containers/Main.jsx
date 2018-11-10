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

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.other || !this.props.other.messages) {
      return;
    }

    if (prevState.conversation
      && prevState.conversation.messages
      && prevState.conversation.messages.length < this.props.other.messages.length) {
      this.scrollToLastMessage();
    }

    const { me } = this.props;

    this.props.other.messages
      .filter(message => message.receiver === me.id)
      .filter(message => !message.isSeen)
      .forEach(message => this.props.markSeen(this.props.other._id, message._id));
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
    const { me, other } = this.props;

    this.setState(({
      draftMessage: '',
    }));

    const newMessage = {
      _id: Math.floor(Math.random() * 100),
      body: draftMessage.trim(),
      sender: me.id,
      receiver: other._id,
      isPending: true,
    };

    this.props.sendMessage(newMessage);
  }

  render() {
    if (!this.props.other || !this.props.other.username) {
      return (
        <div className="app__main">
          <SelectAUser />
        </div>
      );
    }

    const { me, other } = this.props;

    const myAvatar = me.photoUrl;
    const otherAvatar = other.photoUrl || user;

    return (
      <div className="app__main">
        {!other && (
          <SelectAUser />
        )}
        {other && (
          <Fragment>
            <header className="main__header">
              <div className="main__username">
                {other.username}
              </div>
              <div className="main__last-seen">
                Last seen:&nbsp;
                <TimeAgo>{this.state.lastSeen}</TimeAgo>
&nbsp;ago
              </div>
            </header>
            <main className="main__chat">
              <div className="chat__messages">
                {other.messages
                  && other.messages.map((message, index) => (
                    <div
                      key={`${message._id}`}
                      ref={other.messages.length - 1 === index && this.setLastMessageRef}
                      className={classnames(
                        'message',
                        (message.sender === me.id)
                          ? 'message--me'
                          : 'message--other',
                      )}
                    >
                      <div className="message__avatar">
                        <img
                          alt=""
                          src={(message.sender === me.id
                            ? myAvatar
                            : otherAvatar
                          ) || user}
                        />
                      </div>
                      <div className="message__body">
                        {message.body}
                        <i className={classnames(
                          message.sender === me.id
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
                value={this.state.draftMessage}
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
