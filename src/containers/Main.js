import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import user from '../user.png';

import './Main.scss';
import TimeAgo from '../lib/components/TimeAgo';

let lastSeenInterval

function SelectAUser () {
  return (
    <div className='main__please-select'>
      Please select a contact to start chatting.
      <br/>
      Feel free to message anyone :)
    </div>
  )
}

export default class Main extends Component {
  constructor(props) {
    super(props)

    this.state = {
      draftMessage: '',
      lastSeen: null,
      conversation: {}
    }

    this.sendMessage = this.sendMessage.bind(this);
    this.startListening = this.startListening.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.setLastMessageRef = this.setLastMessageRef.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }

  setLastMessageRef (ref) {
    this.lastMessageRef = ref;

    this.scrollToLastMessage();
  }

  componentDidMount () {
    this.startListening();
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.other !== this.props.other) {
      nextProps.me.getConversation(nextProps.other._id)
        .then(conversation => this.setState({ conversation }))
    }

    if (nextProps.other !== this.props.other) {
      clearInterval(lastSeenInterval)
    }

    if (nextProps.other) {
      this.getLastSeen(nextProps.other._id)
      lastSeenInterval = setInterval(() => {
        this.getLastSeen(nextProps.other._id)
      }, 5000);
    }
  }

  componentWillUnmount () {
    clearInterval(lastSeenInterval);
  }

  scrollToLastMessage () {
    if (!this.lastMessageRef) {
      return
    }

    this.lastMessageRef.scrollIntoView({ behavior: 'smooth' })
  }

  componentDidUpdate (prevProps, prevState) {
    if (!this.state.conversation || !this.state.conversation.messages) {
      return
    }

    if (prevState.conversation &&
      prevState.conversation.messages &&
      prevState.conversation.messages.length < this.state.conversation.messages.length) {
        this.scrollToLastMessage()
    }

    const { me } = this.props

    this.state.conversation.messages
      .filter(message => message.receiver === me.data._id)
      .filter(message => !message.isSeen)
      .forEach(message => me.markSeen(message._id))
  }

  startListening () {
    const { me } = this.props

    if (me) {
      me.addListener('new message', data => {
        if (!this.state.conversation ||
          !this.state.conversation._doc ||
          (data.conversationId !== this.state.conversation._doc._id)) {
          return
        }

        this.setState(prevState => ({
          conversation: {
            ...prevState.conversation,
            messages: [
              ...prevState.conversation.messages,
              data.message
            ]
          }
        }));
      });
      me.addListener('marked seen', (message) => {
        if (!this.state.conversation) {
          return
        }

        this.setState(prevState => ({
          conversation: {
            ...prevState.conversation,
            messages: prevState.conversation.messages.map(msg => {
              if (msg._id === message._id) {
                msg.isSeen = true
              }
              return msg
            })
          }
        }));
      })
    }
  }

  getLastSeen (userId) {
    this.props.me.getLastSeen(userId)
      .then(lastSeen => {
        this.setState({ lastSeen })
      })
  }

  handleSendMessage (event) {
    if (event.keyCode === 13 && event.shiftKey === false) {
      this.sendMessage()
    }
  }

  handleMessageChange ({ target }) {
    if (target.value === '\n') {
      this.setState({
        draftMessage: ''
      })
    } else {
      this.setState({
        draftMessage: target.value
      })
    }
  }

  sendMessage () {
    const { draftMessage } = this.state
    const { me, other } = this.props

    this.setState(({
      draftMessage: ''
    }));

    const newMessage = {
      body: draftMessage.trim(),
      sender: me.data._id,
      receiver: other._id,
      isPending: true
    }

    const messagePromise = me.sendMessage(newMessage.body, newMessage.receiver)

    const { conversation } = this.state

    if (!conversation || !conversation.messages) {
      return
    }

    conversation.messages.push(newMessage);

    this.setState({ conversation })

    messagePromise.then(({ _id, receivedAt }) => {
      delete newMessage.isPending;
      newMessage._id = _id;
      newMessage.receivedAt = receivedAt;

      this.setState({ conversation })
    });
  }

  render () {
    if (!this.props.other) {
      return (
        <div className="app__main">
          {!this.props.other && (
            <SelectAUser />
          )}
        </div>
      )
    }

    const { conversation } = this.state;
    const { me, other } = this.props

    const myAvatar = me.data.photoUrl;
    const otherAvatar = other.photoUrl || user;

    return (
      <div className="app__main">
        {!other && (
          <SelectAUser />
        )}
        {other && (
          <Fragment>
            <header className='main__header'>
              <div className='main__username'>
                {other.username}
              </div>
              <div className='main__last-seen'>
                <TimeAgo>{this.state.lastSeen}</TimeAgo>&nbsp;ago
              </div>
            </header>
            <main className="main__chat">
              <div className="chat__messages">
                {conversation.messages &&
                  conversation.messages.map((message, index) => (
                    <div
                      data-sender={message.sender}
                      key={message._id || index}
                      ref={conversation.messages.length - 1 === index && this.setLastMessageRef}
                      className={classnames(
                        'message',
                        (message.sender === me.data._id) ?
                          'message--me' :
                          'message--other'
                      )}>
                      <div className='message__avatar'>
                        <img
                          alt=''
                          src={(message.sender === me.data._id ?
                            myAvatar :
                            otherAvatar
                          ) || user} />
                      </div>
                      <div className='message__body'>
                        {message.body}
                        <i className={classnames(
                          message.sender === me.data._id &&
                          message.isSeen &&
                          'fa fa-check-double',
                          message.isPending && 'far fa-clock')} />
                      </div>
                      <div className='message__time'>
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
              <div className="compose__button" >
                <i className='fab fa-telegram-plane' onClick={this.sendMessage} />
              </div>
              <textarea
                value={this.state.draftMessage}
                onChange={this.handleMessageChange}
                onKeyDown={this.handleSendMessage}
                className="compose__input"
                placeholder="Write a message and hit enter..." />
            </div>
          </Fragment>
        )}
      </div>
    )
  }
}