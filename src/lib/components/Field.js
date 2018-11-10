import React, { Component } from 'react';
import classnames from 'classnames'

export default class Field extends Component {
  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }

  onChange({ target }) {
    this.props.onChange(target.value)
  }
  
  render () {
    const { error } = this.props

    return (
      <div className={classnames('form__group', error && 'form__group--error')}>
        <label>
          {this.props.label}
        </label>
        <div className='field__wrapper'>
          <div className='field__input-wrapper'>
            <input
              type={this.props.type || 'text'}
              value={this.props.value}
              defaultValue={this.props.defaultValue}
              placeholder={this.props.placeholder}
              onChange={this.onChange} />
            {this.props.right}
          </div>
          <div className='form__error'>
            {error && error.message}
          </div>
        </div>
      </div>
    )
  }
}