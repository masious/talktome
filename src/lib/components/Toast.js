import React, { PureComponent } from 'react'
import classnames from 'classnames'

import './Toast.scss'

export default class Toast extends PureComponent {
  static defaultProps = {
    duration: 3000
  }

  constructor(props) {
    super(props)

    this.state = {
      active: false,
      message: ''
    }

    this.props.onRef({
      showMessage: message => {
        this.setState({
          message,
          active: true
        })

        setTimeout(() => {
          this.setState({
            message: '',
            active: false
          })
        }, this.props.duration)
      }
    })
  }

  render () {
    const { active, message } = this.state

    return (
      <div className={classnames('toast', active && 'toast--active')}>
        {message}
      </div>
    )
  }
}
