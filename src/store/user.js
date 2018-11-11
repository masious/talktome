import CurrentUser from '../lib/Chat/CurrentUser';
import { listen, emit } from '../lib/Chat/User';
import { updateContact } from './contacts';

const types = {
  USER: 'USER',
};

const setUser = ({
  _id: id,
  username,
  welcomeMessage,
  photoUrl,
  jwt,
}) => ({
  type: types.USER,
  payload: {
    id, username, welcomeMessage, photoUrl, jwt,
  },
});

export const unsetUser = () => setUser({});

export const actionCreators = {
  login: ({ username, password }) => dispatch => CurrentUser.login({ username, password })
    .then(user => dispatch(setUser(user))),

  signup: ({
    username,
    welcomeMessage,
    photoUrl,
    jwt,
    password,
  }) => dispatch => CurrentUser.signup({
    username,
    welcomeMessage,
    photoUrl,
    jwt,
    password,
  })
    .then(user => dispatch(setUser(user))),

  sendMessage: message => (dispatch, getState) => {
    const {
      user: {
        jwt,
      },
      contacts: {
        [message.receiver]: contact,
      },
    } = getState();

    const messages = [...contact.messages];
    const messageIndex = messages.push(message) - 1;
    dispatch(updateContact({ ...contact, messages }));

    listen(jwt);
    emit('chat message',
      { body: message.body, receiverId: message.receiver },
      (messageFromServer) => {
        messages.splice(messageIndex, 1);

        /* eslint-disable no-param-reassign */
        delete message.isPending;
        message._id = messageFromServer._id;
        message.receivedAt = messageFromServer.receivedAt;
        /* eslint-enable no-param-reassign */

        messages.push(message);
        dispatch(updateContact({ ...contact, messages }));
      });
  },

  updateUserInfo: data => (dispatch, getState) => {
    const { jwt } = getState().user;

    return CurrentUser.post('/users/update', data, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }).then(userInfo => dispatch(setUser(userInfo)));
  },

  changeAvatar: file => (dispatch, getState) => {
    const { user } = getState();

    return CurrentUser.changeAvatar(user.jwt, file)
      .then(({ photoUrl }) => dispatch(setUser({ ...user, photoUrl })));
  },
};

export const persistMiddleware = () => next => (action) => {
  if (action.type === types.USER) {
    localStorage.setItem('user', JSON.stringify(action.payload));
  }

  next(action);
};

let user;
const userFromLocalStorage = localStorage.getItem('user');
if (userFromLocalStorage) {
  user = JSON.parse(userFromLocalStorage);
}

const initialState = user || {
  id: null,
  username: '',
  welcomeMessage: '',
  photoUrl: '',
  jwt: '',
};

export function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case types.USER: {
      return {
        ...payload,
      };
    }
    default: {
      return state;
    }
  }
}
