import { getLastSeen } from "../lib/Chat/User";
import CurrentUser from "../lib/Chat/CurrentUser";
import { updateContact } from "./contacts";

export const types = {
  SET_OTHER_USERNAME: 'SET_OTHER_USERNAME'
}

export const setOther = ({ username }) => ({
  type: types.SET_OTHER_USERNAME,
  payload: username
});

export const unsetOther = () => {
  return setOther({})
};

export const setLastSeen = (userId, lastSeen) => ({
  type: types.SET_LAST_SEEN,
  payload: {
    userId,
    lastSeen
  }
});


export const actionCreators = {
  listenLastSeen: () => (dispatch, getState) => {
    const {
      other: {
        id: userId
      },
      contacts: {
        [userId]: contact
      }
    } = getState()

    getLastSeen(userId)
      .then(lastSeen => dispatch(updateContact({ ...contact, lastSeen })))
  },

  getConversation: username => (dispatch, getState) => {
    const {
      user: {
        jwt
      },
      contacts
    } = getState();

    if (!contacts || Object.keys(contacts).length === 0) {
      return;
    }

    const contact = Object.values(contacts)
      .find(contact => contact.username === username)

    CurrentUser.getConversation(jwt, username)
      .then(({ messages }) => dispatch(updateContact({ ...contact, messages })));
  }
};

const initialState = {
  username: null
};

export function reducer (state = initialState, { type, payload }) {
  switch (type) {
    case types.SET_OTHER_USERNAME: {
      return {
        ...state,
        username: payload
      }
    }
    default: {
      return state;
    }
  }
}
