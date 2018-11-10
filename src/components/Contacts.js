import React, { Component } from 'react';
import classnames from 'classnames';
import FindContactModal from './FindContactModal';
import { NotifyContext } from '../lib/components/Toast';
import Contact from './Contact';

import './Contacts.scss';

const contactSorter = contacts => (aId, bId) => {
  const a = contacts[aId];
  const b = contacts[bId];

  const aLastMessage = a.messages
    && a.messages.length > 0
    && a.messages[a.messages.length - 1]
  const bLastMessage = b.messages
    && b.messages.length > 0
    && b.messages[b.messages.length - 1]

  const aDate = aLastMessage && aLastMessage.receivedAt;
  const bDate = bLastMessage && bLastMessage.receivedAt;

  if (aDate && !bDate) {
    return -1;
  } else if (!aDate && bDate) {
    return 1;
  } else {
    return (new Date(bDate)).getTime() - (new Date(aDate)).getTime();
  }
}

const newMessageSound = new Audio('/pop.mp3');

export default class Contacts extends Component {
  static contextType = NotifyContext;

  constructor(props) {
    super(props)

    this.state = {
      isFindModalOpen: false
    };

    this.addContact = this.addContact.bind(this)
    this.openFindModal = this.changeFindModalState.bind(this, true);
    this.closeFindModal = this.changeFindModalState.bind(this, false);
  }

  addContact (userId) {
    this.props.addContact(userId)
      .then(user => {
        this.context.notify(`${user.username} added to contacts.`)
      });
  }

  openConversation = contact => {
    this.props.navigate(`/chat/${contact.username}`);
  }

  changeFindModalState (state) {
    this.setState({
      isFindModalOpen: state
    })
  }

  componentDidMount () {
    this.props.getContacts()
  }

  render () {
    const hasContact = this.props.other && this.props.other.username;
    const activeClass = !hasContact && 'app__contacts--active';

    return (
      <aside className={classnames('app__contacts', activeClass)}>
        <header className='contacts__header'>
          <div className='contacts__title'>
            Contacts
          </div>
          <div className='contacts__find' onClick={this.openFindModal}>
            Find...
          </div>
        </header>
        <ul className="contacts__list">
          {Object
            .keys(this.props.contacts)
            .sort(contactSorter(this.props.contacts))
            .map((contactId, index) => (
              <Contact
                onClick={this.openConversation}
                key={index}
                contact={this.props.contacts[contactId]}
                isActive={this.props.other === this.props.contacts[contactId]} />
            ))}
        </ul>
        <FindContactModal
          isOpen={this.state.isFindModalOpen}
          onAdd={this.addContact}
          search={this.props.search}
          searchResult={this.props.searchResult}
          handleClose={this.closeFindModal} />
      </aside>
    )
  }
}
