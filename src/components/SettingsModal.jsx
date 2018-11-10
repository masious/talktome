import React, { Component } from 'react';
import Modal from '../lib/components/Modal';
import Field from '../lib/components/Field';
import SettingsAvatar from './SettingsAvatar';
import { NotifyContext } from '../lib/components/Toast';
import user from '../user.png';

import './SettingsModal.scss';

export default class SettingsModal extends Component {
  static contextType = NotifyContext;

  state = {
    username: this.props.me.username,
    password: this.props.me.password,
    welcomeMessage: this.props.me.welcomeMessage,
  };

  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.changeAvatar = this.changeAvatar.bind(this);
    this.changeUsername = this.changeField.bind(this, 'username');
    this.changePassword = this.changeField.bind(this, 'password');
    this.changeWelcomeMessage = this.changeField.bind(this, 'welcomeMessage');
  }

  changeField(fieldName, value) {
    this.setState({
      [fieldName]: value,
    });
  }

  changeAvatar(file) {
    this.props.me.changeAvatar(file)
      .then(() => this.context.notify('Avatar changed successfully.'));
  }

  save() {
    this.props.updateUserInfo(this.state)
      .then(() => {
        this.context.notify('Changes saved successfully.');
        this.props.handleClose();
      });
  }

  render() {
    if (!this.props.me) {
      return null;
    }
    return (
      <Modal
        title="Edit Profile"
        footerActions={[{
          title: 'Save',
          onClick: this.save,
        }, {
          title: 'Cancel',
          onClick: this.props.handleClose,
        }]}
        isOpen={this.props.isOpen}
        onRequestClose={this.props.handleClose}
      >
        <div className="settings">
          <SettingsAvatar
            onChange={this.changeAvatar}
            src={this.props.me.photoUrl || user}
          />
          <form className="settings__form form--vertical">
            <Field
              label="Username"
              type="text"
              onChange={this.changeUsername}
              defaultValue={this.props.me.username}
            />
            <Field
              label="Password"
              type="password"
              placeholder="(unchanged)"
              onChange={this.changePassword}
              value={this.state.password}
            />
            <Field
              label="Welcome Message"
              type="text"
              onChange={this.changeWelcomeMessage}
              value={this.state.welcomeMessage}
            />
          </form>
        </div>
      </Modal>
    );
  }
}
