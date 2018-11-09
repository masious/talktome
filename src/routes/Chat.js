import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Contacts from '../components/Contacts';
import Main from '../containers/Main';
import SettingsModal from '../components/SettingsModal';
import { actionCreators } from '../store/contacts';
import { actionCreators as otherActionCreators } from '../store/other';
import { actionCreators as userActionCreators } from '../store/user';
import { setOther } from '../store/other';

class Chat extends Component {
  state = {
    contactsActive: true,
    requestedUsername: ''
  }

  componentDidMount () {
    const {
      me,
      history,
      match,
      setOther,
      getConversation,
      listenForMarkedSeen,
      listenForNewMessages
    } = this.props

    if (!me.username) {
      history.push('/');
      return;
    }

    if (match.params.username) {
      setOther({ username: match.params.username });
      getConversation(match.params.username);
    }

    listenForMarkedSeen();
    listenForNewMessages();
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.match.params.username !== this.props.match.params.username) {
      nextProps.setOther({ username: nextProps.match.params.username });
      nextProps.getConversation(nextProps.match.params.username);
    }
  }

  render () {
    const {
      me,
      other,
      contacts,
      getContacts,
      markSeen,
      sendMessage,
      getConversation
    } = this.props

    if (!me.username) {
      return null
    }

    return (
      <Fragment>
        <Contacts
          me={me}
          other={other}
          notify={this.notify}
          contacts={contacts}
          getContacts={getContacts}
        />
        <Main
          me={me}
          other={other}
          markSeen={markSeen}
          sendMessage={sendMessage}
          getConversation={getConversation} />
        <Route
          exact
          path='/settings'
          render={() => (
            <SettingsModal
              notify={this.notify}
              isOpen={true}
              handleClose={this.closeSettings}
              me={me}
            />
          )}>
        </Route>
      </Fragment>
    )
  }
}
const mapState = ({ user: me, other, contacts }) => {
  console.log(other)
  return {
    me,
    other: contacts && Object.values(contacts)
      .find(contact => other.username === contact.username),
    contacts
  }
}

const mapDispatch = dispatch => ({
  setOther: data => dispatch(setOther(data)),
  ...bindActionCreators({
    getConversation: otherActionCreators.getConversation,
    sendMessage: userActionCreators.sendMessage,
    markSeen: actionCreators.markSeen,
    getContacts: actionCreators.getContacts,
    listenForNewMessages: actionCreators.listenForNewMessages,
    listenForMarkedSeen: actionCreators.listenForMarkedSeen
  }, dispatch),
});

export default connect(mapState, mapDispatch)(Chat);
