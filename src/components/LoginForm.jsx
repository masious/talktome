import React, { PureComponent } from 'react';
import Field from '../lib/components/Field';

export default class SignupForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleUsernameChange = this.handleFormChange.bind(this, 'username');
    this.handlePasswordChange = this.handleFormChange.bind(this, 'password');
  }

  handleFormChange(fieldName, value) {
    this.setState({ [fieldName]: value });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.state);
  }

  render() {
    const { errors } = this.props;

    return (
      <div className="signup">
        <form className="form--vertical" noValidate onSubmit={this.onSubmit}>
          <Field
            label="Username or email"
            onChange={this.handleUsernameChange}
            error={errors && errors.username}
            type="text"
          />
          <Field
            label="Password"
            onChange={this.handlePasswordChange}
            error={errors && errors.password}
            type="password"
          />
          <input className="btn--primary" type="submit" value="Login" />
        </form>
      </div>
    );
  }
}
