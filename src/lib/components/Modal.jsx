import React, { Component } from 'react';
import ReactModal from 'react-modal';

import './Modal.scss';

// ReactModal.setAppElement('#container')

export default class Modal extends Component {
  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        shouldCloseOnOverlayClick
        className="modal"
        ariaHideApp={false}
        overlayClassName="overlay"
      >
        {this.props.title && (
          <div className="modal__header">
            <div className="modal__title">
              {this.props.title}
            </div>
            <div className="modal__close" onClick={this.props.onRequestClose}>
              <i className="fa fa-times" />
            </div>
          </div>
        )}
        <div className="modal__body">
          {this.props.children}
        </div>
        {this.props.footerActions && (
        <div className="modal__footer">
          {this.props.footerActions.map(action => (
            <div className="modal__action" key={action.title} onClick={action.onClick}>
              {action.title}
            </div>
          ))}
        </div>
        )}
      </ReactModal>
    );
  }
}
