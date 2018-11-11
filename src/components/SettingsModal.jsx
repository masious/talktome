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

    this.changeUsername = this.changeField.bind(this, 'username');
    this.changePassword = this.changeField.bind(this, 'password');
    this.changeWelcomeMessage = this.changeField.bind(this, 'welcomeMessage');
  }

  changeAvatar = (file) => {
    const { changeAvatar } = this.props;
    const { notify } = this.context;

    changeAvatar(file)
      .then(() => notify('Avatar changed successfully.'));
  }

  save = () => {
    const { updateUserInfo, handleClose } = this.props;
    const { notify } = this.context;

    updateUserInfo(this.state)
      .then(() => {
        notify('Changes saved successfully.');
        handleClose();
      });
  }

  changeField(fieldName, value) {
    this.setState({
      [fieldName]: value,
    });
  }

  render() {
    const {
      me,
      handleClose,
      isOpen,
    } = this.props;

    if (!me) {
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
          onClick: handleClose,
        }]}
        isOpen={isOpen}
        onRequestClose={handleClose}
      >
        <div className="settings">
          <SettingsAvatar
            onChange={this.changeAvatar}
            src={me.photoUrl || user}
          />
          <form className="settings__form form--vertical">
            <Field
              label="Username"
              type="text"
              onChange={this.changeUsername}
              defaultValue={me.username}
            />
            <Field
              label="Password"
              type="password"
              placeholder="(unchanged)"
              onChange={this.changePassword}
              defaultValue={me.password}
            />
            <Field
              label="Welcome Message"
              type="text"
              onChange={this.changeWelcomeMessage}
              defaultValue={me.welcomeMessage}
            />
          </form>
        </div>
      </Modal>
    );
  }
}
