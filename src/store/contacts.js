import CurrentUser from '../lib/Chat/CurrentUser';
import { listen, addListener, emit } from '../lib/Chat/User';
import { types as otherTypes } from './other';

const types = {
  GET_CONTACTS: 'GET_CONTACTS',
  ADD_CONTACT: 'ADD_CONTACT',
  UPDATE_CONTACT: 'UPDATE_CONTACT',
};

const setContacts = contacts => ({
  type: types.GET_CONTACTS,
  payload: contacts,
});

export const updateContact = contact => ({
  type: types.UPDATE_CONTACT,
  payload: contact,
});

export const addContact = contact => ({
  type: types.ADD_CONTACT,
  payload: contact,
});

export const actionCreators = {
  getContacts: () => (dispatch, getState) => {
    const {
      user: {
        jwt,
      },
    } = getState();

    return CurrentUser.getContacts(jwt)
      .then(contacts => dispatch(setContacts(contacts)));
  },

  listenForNewMessages: () => (dispatch, getState) => {
    const { jwt } = getState().user;

    listen(jwt);
    addListener('new message', ({ message }) => {
      const { contacts } = getState();

      const contactId = message.isSent ? message.receiver : message.sender;
      const contact = contacts[contactId];

      // might be a new user who is not in the contacts
      if (!contact) {
        return; // TODO: send a request to get new user info
      }
      // Avoiding mutation on store object
      const messages = [...contact.messages];
      messages.push(message);

      const newContact = {
        ...contact,
        messages,
        unreadCount: contact.unreadCount ? contact.unreadCount + 1 : 1,
      };

      dispatch(updateContact(newContact));
    });
  },

  listenForMarkedSeen: () => (dispatch, getState) => {
    const { jwt } = getState().user;
    listen(jwt);
    addListener('marked seen', (message) => {
      const { _id } = getState().user;

      const contactId = message.sender === _id
        ? message.receiver
        : message.sender;

      const { contacts } = getState();
      const contact = contacts[contactId];
      const messages = [...contact.messages];

      const messageIndex = messages
        .findIndex(({ _id }) => _id === message._id);

      if (messageIndex < 0) {
        return;
      }

      messages[messageIndex].isSeen = true;

      dispatch(updateContact({ ...contact, messages }));
    });
  },

  markSeen: (userId, messageId) => (dispatch, getState) => {
    const {
      user: {
        jwt,
      },
      contacts: {
        [userId]: contact,
      },
    } = getState();

    // prepare socket
    listen(jwt);
    emit('mark seen', messageId);

    const messages = [...contact.messages];
    const message = messages.find(({ _id }) => _id === messageId);
    message.isSeen = true;
    contact.unreadCount = contact.unreadCount > 0 ? contact.unreadCount - 1 : 0;

    return updateContact({ ...contact, messages });
  },
};

const initialState = {};

export function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case types.GET_CONTACTS: {
      return {
        ...payload,
        ...state, // What we already have in the store,
        // is more valid than what is dispatched.
      };
    }
    case types.UPDATE_CONTACT: {
      return {
        ...state,
        [payload._id]: payload,
      };
    }
    case otherTypes.SET_LAST_SEEN: {
      return {
        ...state,
        [payload.userId]: {
          ...state[payload.userId],
          lastSeen: payload.lastSeen,
        },
      };
    }
    case types.ADD_CONTACT: {
      return {
        ...state,
        [payload._id]: payload,
      };
    }
    default: {
      return state;
    }
  }
}
