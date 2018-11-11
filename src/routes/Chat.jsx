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
import { actionCreators as miscActionCreators } from '../store/misc';
import { setOther } from '../store/other';

class Chat extends Component {
  componentDidMount() {
    const {
      me,
      history,
      match,
      other,
      setOther,
      getConversation,
      listenForMarkedSeen,
      listenOtherLastSeen,
      listenForNewMessages,
    } = this.props;

    if (!me.username) {
      history.push('/');
      return;
    }

    if (match.params.username && match.params.username !== 'settings') {
      setOther({ username: match.params.username });
      getConversation(match.params.username);
    }

    listenForMarkedSeen();
    listenForNewMessages();

    this.lastSeenInterval = listenOtherLastSeen(5000);
  }

  componentWillReceiveProps(nextProps) {
    const {
      username: newUsername,
    } = nextProps.match.params;

    if (newUsername
      && newUsername !== this.props.match.params.username
      && newUsername !== 'settings') {
      nextProps.setOther({ username: newUsername });
      nextProps.getConversation(newUsername);

      if (this.lastSeenInterval) {
        clearInterval(this.lastSeenInterval);
      }
      this.lastSeenInterval = this.props.listenOtherLastSeen(5000);
    }
  }

  closeSettings = () => {
    let url = '/chat';

    const { other, history } = this.props;

    if (other && other.username) {
      url += `/${other.username}`;
    }
    history.push(url);
  }

  render() {
    const {
      me,
      other,
      contacts,
      getContacts,
      markSeen,
      search,
      searchResult,
      sendMessage,
      history,
      addContact,
      updateUserInfo,
      changeAvatar,
      getConversation,
    } = this.props;

    if (!me.username) {
      return null;
    }

    return (
      <Fragment>
        <Contacts
          me={me}
          other={other}
          search={search}
          navigate={history.push}
          addContact={addContact}
          searchResult={searchResult}
          contacts={contacts}
          getContacts={getContacts}
        />
        <Main
          me={me}
          other={other}
          markSeen={markSeen}
          sendMessage={sendMessage}
          getConversation={getConversation}
        />
        <Route
          path="/chat/settings"
          render={() => (
            <SettingsModal
              isOpen
              handleClose={this.closeSettings}
              me={me}
              updateUserInfo={updateUserInfo}
              changeAvatar={changeAvatar}
            />
          )}
        />
      </Fragment>
    );
  }
}
const mapState = ({
  user: me, other, contacts, misc,
}) => ({
  me,
  contacts,
  searchResult: misc.searchResult,
  other: contacts && Object.values(contacts)
    .find(contact => other.username === contact.username),
});

const mapDispatch = dispatch => ({
  setOther: data => dispatch(setOther(data)),
  ...bindActionCreators({
    search: miscActionCreators.search,
    listenOtherLastSeen: otherActionCreators.listenOtherLastSeen,
    updateUserInfo: userActionCreators.updateUserInfo,
    changeAvatar: userActionCreators.changeAvatar,
    getConversation: otherActionCreators.getConversation,
    sendMessage: userActionCreators.sendMessage,
    markSeen: actionCreators.markSeen,
    addContact: miscActionCreators.addContact,
    getContacts: actionCreators.getContacts,
    listenForNewMessages: actionCreators.listenForNewMessages,
    listenForMarkedSeen: actionCreators.listenForMarkedSeen,
  }, dispatch),
});

export default connect(mapState, mapDispatch)(Chat);
