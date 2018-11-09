import CurrentUser from "../lib/Chat/CurrentUser";
import { listen, addListener, emit } from "../lib/Chat/User";
import { types as otherTypes } from './other';

const types = {
  GET_CONTACTS: 'GET_CONTACTS',
  UPDATE_CONTACT: 'UPDATE_CONTACT'
};

const setContacts = contacts => ({
  type: types.GET_CONTACTS,
  payload: contacts
});

export const updateContact = contact => ({
  type: types.UPDATE_CONTACT,
  payload: contact
})

export const actionCreators = {
  getContacts: () => (dispatch, getState) => {
    const {
      user: {
        jwt
      },
      contacts: previousContacts
    } = getState();

    return CurrentUser.getContacts(jwt)
      .then(contacts => {
        if (!previousContacts || Object.keys(previousContacts).length === 0) {
          dispatch(setContacts(contacts));
          return;
        }
        Object.keys(contacts)
          .forEach(contactId => {
            const messages = contacts[contactId].messages;
            previousContacts[contactId].messages
              .forEach(message => {
                const alreadyExists = messages
                  .some(msg => msg._id === message._id);

                if (!alreadyExists) {
                  messages.push(message);
                }
              });
              messages.sort((a, b) => {
                const aDate = new Date(a.receivedAt);
                const bDate = new Date(b.receivedAt);

                return aDate - bDate
              })
          });
        dispatch(setContacts(contacts));
      });
  },

  listenForNewMessages: () => (dispatch, getState) => {
    const { jwt } = getState().user

    listen(jwt);
    addListener('new message', ({ message }) => {
      console.log(message);
      const { contacts } = getState();

      const contactId = message.isSent ? message.receiver : message.sender
      const contact = contacts[contactId]

      // might be a new user who is not in the contacts
      if (!contact) {
        return; // TODO: send a request to get new user info
      }
      // Avoiding mutation on store object
      const messages = [...contact.messages];
      messages.push(message);

      dispatch(updateContact({ ...contact, messages }));
      console.log('last');
    });
  },

  listenForMarkedSeen: () => (dispatch, getState) => {
    const { jwt } = getState().user

    listen(jwt)
    addListener('marked seen', message => {
      const contactId = message.isSent ?
        message.receiver :
        message.sender;

      const { contacts } = getState();

      const contact = contacts[contactId];
      const messages = [...contact.messages];

      const messageIndex = messages
        .findIndex(msg => msg._id === message.id);

      delete messages[messageIndex];
      messages.push(message)

      dispatch(updateContact({ ...contact, messages }));
    });
  },

  markSeen: (userId, messageId) => (dispatch, getState) => {
    const {
      user: {
        jwt
      },
      contacts: {
        [userId]: contact
      }
    } = getState()

    // prepare socket
    listen(jwt);
    emit('mark seen', messageId);

    const messages = [...contact.messages];
    const message = messages.find(msg => msg._id === messageId);
    message.isSeen = true;
    contact.unreadCount = contact.unreadCount > 0 ? contact.unreadCount - 1 : 0;

    return updateContact({ ...contact, messages });
  }
}

const initialState = {};

export function reducer (state = initialState, { type, payload }) {
  switch (type) {
    case types.GET_CONTACTS: {
      return {
        ...payload
      };
    }
    case types.UPDATE_CONTACT: {
      return {
        ...state,
        [payload._id]: payload
      }
    }
    case otherTypes.SET_LAST_SEEN: {
      return {
        ...state,
        [payload.userId]: {
          ...state[payload.userId],
          lastSeen: payload.lastSeen
        }
      }
    }
    default: {
      return state;
    }
  }
};
