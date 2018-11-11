import { getLastSeen, listen, emit } from '../lib/Chat/User';
import CurrentUser from '../lib/Chat/CurrentUser';
import { updateContact } from './contacts';

export const types = {
  SET_OTHER_USERNAME: 'SET_OTHER_USERNAME',
};

export const setOther = ({ username }) => ({
  type: types.SET_OTHER_USERNAME,
  payload: username,
});

export const unsetOther = () => setOther({});

export const actionCreators = {
  listenOtherLastSeen: interval => (dispatch, getState) => setInterval(
    () => {
      const {
        user: {
          jwt,
        },
        other: {
          username,
        },
        contacts,
      } = getState();

      if (!username) {
        return;
      }

      const contact = Object.values(contacts)
        .find(c => c.username === username);

      if (!contact) {
        return;
      }

      listen(jwt);
      emit(
        'getLastSeen',
        username,
        lastSeen => dispatch(updateContact({ ...contact, lastSeen })),
      );
    },
    interval,
  ),

  getConversation: username => (dispatch, getState) => {
    const {
      user: {
        jwt,
      },
    } = getState();

    CurrentUser.getConversation(jwt, username)
      .then(contact => dispatch(updateContact(contact)));
  },
};

const initialState = {
  username: null,
};

export function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case types.SET_OTHER_USERNAME: {
      return {
        ...state,
        username: payload,
      };
    }
    default: {
      return state;
    }
  }
}
