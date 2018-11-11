import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SignupForm from '../components/SignupForm';
import { actionCreators } from '../store/user';


class Signup extends Component {
  state = {
    errors: [],
  }

  render() {
    return (
      <SignupForm
        onSubmit={this.props.signup}
        errors={this.state.errors}
      />
    );
  }
}

const mapDispatch = dispatch => ({
  signup: bindActionCreators(actionCreators.signup, dispatch),
});

export default connect(null, mapDispatch)(Signup);
