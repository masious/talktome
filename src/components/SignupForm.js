import React, { PureComponent } from 'react';
import Field from '../lib/components/Field';

export default class SignupForm extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      email: '',
      password: '',
      welcomeMessage: ''
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.handleUsernameChange = this.handleFormChange.bind(this, 'username')
    this.handleEmailChange = this.handleFormChange.bind(this, 'email')
    this.handlePasswordChange = this.handleFormChange.bind(this, 'password')
    this.handleWelcomeMessageChange = this.handleFormChange.bind(this, 'welcomeMessage')
  }

  handleFormChange (fieldName, value) {
    this.setState({ [fieldName]: value })
  }

  onSubmit (e) {
    e.preventDefault();
    this.props.onSubmit(this.state)
  }

  render () {
    const { errors } = this.props

    return (
      <div className='signup'>
        <form className='form--vertical' noValidate onSubmit={this.onSubmit}>
          <Field
            label='Username'
            onChange={this.handleUsernameChange}
            error={errors && errors.username}
            type='text'
          />
          <Field
            label='Email'
            onChange={this.handleEmailChange}
            error={errors && errors.email}
            type='email' />
          <Field
            label='Password'
            onChange={this.handlePasswordChange}
            error={errors && errors.password}
            type='password' />

          <Field
            label='Welcome Message'
            onChange={this.handleWelcomeMessageChange}
            error={errors && errors.welcomeMessage}
            placeholder='Talk to me.'
            type='text' />
          <input type="submit" className='btn--primary' value="Signup" />
        </form>
      </div>
    )
  }
}
