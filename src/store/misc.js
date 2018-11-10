import CurrentUser from '../lib/Chat/CurrentUser';
import { addContact } from './contacts';

const types = {
  SEARCH_RESULT: 'SEARCH_RESULT',
};

const searchResult = users => ({
  type: types.SEARCH_RESULT,
  payload: users,
});

export const actionCreators = {
  search: username => (dispatch, getState) => {
    const { jwt } = getState().user;
    return CurrentUser.search(jwt, username)
      .then(users => dispatch(searchResult(users)));
  },

  addContact: userId => (dispatch, getState) => {
    const { jwt } = getState().user;

    return CurrentUser.addContact(jwt, userId)
      .then((contact) => {
        dispatch(addContact(contact));
        return contact;
      });
  },
};

const initialState = {
  searchResult: [],
};

export function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case types.SEARCH_RESULT: {
      return {
        ...state,
        searchResult: payload,
      };
    }
    default: {
      return state;
    }
  }
}
