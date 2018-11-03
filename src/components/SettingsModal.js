import React, { Component } from 'react'
import Modal from '../lib/components/Modal';
import Field from '../lib/components/Field';
import saveUser from '../utils/saveUser';
import user from '../user.png';

import './SettingsModal.scss';
import SettingsAvatar from './SettingsAvatar';

export default class SettingsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.me.data.username,
      password: '',
      welcomeMessage: this.props.me.data.welcomeMessage
    }

    this.save = this.save.bind(this);
    this.changeAvatar = this.changeAvatar.bind(this);
    this.changeUsername = this.changeField.bind(this, 'username');
    this.changePassword = this.changeField.bind(this, 'password');
    this.changeWelcomeMessage = this.changeField.bind(this, 'welcomeMessage');
  }

  changeField(fieldName, value) {
    this.setState({
      [fieldName]: value
    })
  }

  changeAvatar (file) {
    this.props.me.changeAvatar(file)
      .then(() => this.props.notify('Avatar changed successfully.'))
  }

  save () {
    this.props.me.updateUserInfo(this.state)
      .then(user => {
        saveUser(user)
        this.props.notify('Changes saved successfully.')
        this.props.handleClose()
      })
  }

  render () {
    return (
      <Modal
        title='Edit Profile'
        footerActions={[{
          title: 'Save',
          onClick: this.save
        }, {
          title: 'Cancel',
          onClick: this.props.handleClose
        }]}
        isOpen={this.props.isOpen}
        onRequestClose={this.props.handleClose}>
        <div className='settings'>
          <SettingsAvatar
            onChange={this.changeAvatar}
            src={this.props.me.data.photoUrl || user} />
          <form className='settings__form form--vertical'>
            <Field
              label='Username'
              type='text'
              onChange={this.changeUsername}
              value={this.state.username} />
            <Field
              label='Password'
              type='password'
              placeholder='(unchanged)'
              onChange={this.changePassword}
              value={this.state.password} />
            <Field
              label='Welcome Message'
              type='text'
              onChange={this.changeWelcomeMessage}
              value={this.state.welcomeMessage} />
          </form>
        </div>
      </Modal>
    )
  }
}