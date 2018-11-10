import React, { Component } from 'react';
import classnames from 'classnames';

import './Dropdown.scss';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  setWrapperRef(ref) {
    this.wrapperRef = ref;
  }

  handleOpen() {
    this.setState({
      isOpen: true,
    });
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.wrapperRef
      && this.state.isOpen
      && !this.wrapperRef.contains(event.target)) {
      this.setState({
        isOpen: false,
      });
    }
  }

  render() {
    return (
      <div className="dropdown" ref={this.setWrapperRef}>
        <div className="dropdown__header" onClick={this.handleOpen}>
          {this.props.header}
        </div>
        <ul
          className={classnames(
            'dropdown__items',
            this.state.isOpen && 'dropdown__items--open',
          )}
        >
          {this.props.children}
        </ul>
      </div>
    );
  }
}
