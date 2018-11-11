import React, { Component } from 'react';
import Modal from '../lib/components/Modal';
import userImg from '../user.png';

import './FindContactModal.scss';
import Contact from './Contact';

export default class FindContactModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };

    this.addContact = this.addContact.bind(this);
    this.searchContacts = this.searchContacts.bind(this);
  }

  searchContacts = ({ target }) => {
    this.props.search(target.value);
  }

  addContact(user) {
    this.props.onAdd(user._id);
  }

  render() {
    return (
      <Modal
        title="Find Contacts"
        isOpen={this.props.isOpen}
        onRequestClose={this.props.handleClose}
      >
        <div className="field__input-wrapper">
          <i className="p fa fa-search" />
          <input
            type="text"
            onChange={this.searchContacts}
            placeholder="Search usernames..."
          />
        </div>
        <ul className="list find__list">
          {this.props.searchResult.map(user => (
            <Contact
              contact={user}
              onClick={this.addContact}
              extra={{ message: user.welcomeMessage, date: user.lastSeen }}
              key={user._id}
            />
          ))}
        </ul>
      </Modal>
    );
  }
}
