import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoginForm from '../components/LoginForm';
import { actionCreators } from '../store/user';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: null,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(userData) {
    this.props.login(userData);
  }

  render() {
    return (
      <LoginForm
        onSubmit={this.onSubmit}
        errors={this.state.errors}
      />
    );
  }
}

const mapDispatch = dispatch => ({
  login: bindActionCreators(actionCreators.login, dispatch),
});

export default connect(null, mapDispatch)(Login);
