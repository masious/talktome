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
    && a.messages[a.messages.length - 1];
  const bLastMessage = b.messages
    && b.messages.length > 0
    && b.messages[b.messages.length - 1];

  const aDate = aLastMessage && aLastMessage.receivedAt;
  const bDate = bLastMessage && bLastMessage.receivedAt;

  if (aDate && !bDate) {
    return -1;
  } if (!aDate && bDate) {
    return 1;
  }
  return (new Date(bDate)).getTime() - (new Date(aDate)).getTime();
};

const newMessageSound = new Audio('/pop.mp3');

export default class Contacts extends Component {
  static contextType = NotifyContext;

  constructor(props) {
    super(props);

    this.state = {
      isFindModalOpen: false,
    };

    this.addContact = this.addContact.bind(this);
    this.openFindModal = this.changeFindModalState.bind(this, true);
    this.closeFindModal = this.changeFindModalState.bind(this, false);
  }

  componentDidMount () {
    const { getContacts } = this.props;
    getContacts();
  }

  openConversation = (contact) => {
    const { navigate } = this.props;
    navigate(`/chat/${contact.username}`);
  }

  addContact (userId) {
    const { addContact } = this.props;
    const { notify } = this.context;
    addContact(userId)
      .then((user) => {
        notify(`${user.username} added to contacts.`);
      });
  }

  changeFindModalState (state) {
    this.setState({
      isFindModalOpen: state,
    });
  }

  render () {
    const {
      other,
      contacts,
      search,
      searchResult
    } = this.props;

    const {
      isFindModalOpen,
    } = this.state;

    const hasContact = other && other.username;
    const activeClass = !hasContact && 'app__contacts--active';

    return (
      <aside className={classnames('app__contacts', activeClass)}>
        <header className="contacts__header">
          <div className="contacts__title">
            Contacts
          </div>
          <button className="contacts__find" type="button" onClick={this.openFindModal}>
            Find...
          </button>
        </header>
        <ul className="contacts__list">
          {Object
            .keys(contacts)
            .sort(contactSorter(contacts))
            .map(contactId => (
              <Contact
                onClick={this.openConversation}
                key={contactId}
                contact={contacts[contactId]}
                isActive={other === contacts[contactId]}
              />
            ))}
        </ul>
        <FindContactModal
          isOpen={isFindModalOpen}
          onAdd={this.addContact}
          search={search}
          searchResult={searchResult}
          handleClose={this.closeFindModal}
        />
      </aside>
    );
  }
}
