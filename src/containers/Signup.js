import React, { Component } from 'react'
import SignupForm from '../components/SignupForm';
import CurrentUser from '../lib/Chat/CurrentUser';
import saveUser from '../utils/saveUser'

export default class Signup extends Component {
  constructor (props) {
    super(props)

    this.state = {
      errors: null
    }

    this.onSubmit = this.onSubmit.bind(this)
  }
  onSubmit (userData) {
    CurrentUser.signup(userData)
      .then(user => {
        saveUser(user)
        this.props.setUser(user)
      })
      .catch(err => {
        this.setState({ errors: err.response.data.errors })
      })
  }

  render () {
    return (
      <SignupForm onSubmit={this.onSubmit} errors={this.state.errors} />
    )
  }
}
