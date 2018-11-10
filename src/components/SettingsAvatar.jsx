import React, { Component } from 'react';

import './SettingsAvatar.scss';

export default class SettingsAvatar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      temp: null,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const file = event.target.files[0];
    this.props.onChange(file);

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      this.setState({
        temp: target.result,
      });
    };
    reader.readAsDataURL(file);
  }

  render() {
    return (
      <div className="avatar">
        <input type="file" id="file" onChange={this.handleChange} className="avatar__input" />
        <div className="avatar__overlay">
          <label htmlFor="file" className="avatar__change">
            Change
          </label>
        </div>
        <img
          className="avatar__img"
          alt="User Avatar"
          src={this.state.temp || this.props.src}
        />
      </div>
    );
  }
}
