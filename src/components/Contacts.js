import React, { Component } from 'react';
import classnames from 'classnames';
import FindContactModal from './FindContactModal';

import './Contacts.scss';
import Contact from './Contact';

const contactSorter = contacts => (aId, bId) => {
  const a = contacts[aId];
  const b = contacts[bId];
  const aDate = a.lastMessage && a.lastMessage.receivedAt;
  const bDate = b.lastMessage && b.lastMessage.receivedAt;

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
    this.props.me.addContact(userId)
      .then(user => {
        this.props.notify(`${user.username} added to contacts.`)
      })
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
                key={index}
                contact={this.props.contacts[contactId]}
                isActive={this.props.other === this.props.contacts[contactId]} />
            ))}
        </ul>
        <FindContactModal
          isOpen={this.state.isFindModalOpen}
          onAdd={this.addContact}
          me={this.props.me}
          handleClose={this.closeFindModal} />
      </aside>
    )
  }
}
