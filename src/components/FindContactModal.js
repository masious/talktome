import React, { Component } from 'react'
import AsyncSelect from 'react-select/lib/Async';
import Modal from '../lib/components/Modal';

export default class FindContactModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: []
    }

    this.addContact = this.addContact.bind(this);
    this.searchContacts = this.searchContacts.bind(this);
  }

  searchContacts (username, callback) {
    this.props.me.search(username)
      .then(users => {
        callback(users.map(user => ({
          label: user.data.username,
          value: user.data._id
        })))
      })
  }

  addContact (option, { action }) {
    if (action !== 'select-option') {
      return
    }

    this.props.onAdd(option.value)
  }

  render () {
    return (
      <Modal
        title='Find Contacts'
        isOpen={this.props.isOpen}
        onRequestClose={this.props.handleClose}>
        <AsyncSelect
          cacheOptions
          loadOptions={this.searchContacts}
          placeholder='Search Usernames...'
          onChange={this.addContact}
          onInputChange={this.handleInputChange} />
      </Modal>
    )
  }
}