import ChatApi from './ChatApi'
import io from 'socket.io-client';

export default class User extends ChatApi {
  constructor(data) {
    super(...arguments)

    this.data = data
  }
}

let socket = null
const callbacks = {}

export const listen = jwt => {
  if (!socket) {
    const prefix = process.env.NODE_ENV === 'development' ?
      'http://localhost:3001' : '';

    socket = io(`${prefix}/?token=${jwt}`);

    socket.on('new message', data => {
      callbacks['new message'].forEach(cb => {
        cb(data)
      });
    });
    socket.on('marked seen', data => {
      callbacks['marked seen'].forEach(cb => {
        cb(data);
      });
    });
  }

  return socket
}

export const addListener = (eventName, cb) => {
  if (!callbacks[eventName]) {
    callbacks[eventName] = [];
  }
  callbacks[eventName].push(cb);
}

export const getLastSeen = userId => {
  return new Promise(resolve => {
    socket.emit('getLastSeen', userId, resolve);
  });
};

export const emit = (...args) => {
  socket.emit(...args);
};
