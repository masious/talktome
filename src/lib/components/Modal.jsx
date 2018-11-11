import React, { PureComponent } from 'react';
import ReactModal from 'react-modal';

import './Modal.scss';

export default class Modal extends PureComponent {
  render() {
    const {
      isOpen,
      onRequestClose,
      title,
      children,
      footerActions,
    } = this.props;

    return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        shouldCloseOnOverlayClick
        shouldCloseOnEsc
        className="modal"
        ariaHideApp={false}
        overlayClassName="overlay"
      >
        {title && (
          <div className="modal__header">
            <div className="modal__title">
              {title}
            </div>
            <div className="modal__close" onClick={onRequestClose}>
              <i className="fa fa-times" />
            </div>
          </div>
        )}
        <div className="modal__body">
          {children}
        </div>
        {footerActions && (
        <div className="modal__footer">
          {footerActions.map(action => (
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
