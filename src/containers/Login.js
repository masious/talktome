import React, { Component } from 'react'
import LoginForm from '../components/LoginForm';
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
    CurrentUser.login(userData)
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
      <LoginForm onSubmit={this.onSubmit} errors={this.state.errors} />
    )
  }
}
