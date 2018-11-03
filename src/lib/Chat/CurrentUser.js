import User from './User'
import io from 'socket.io-client';

export default class CurrentUser extends User {
  constructor(props) {
    super(props)

    this.callbacks = {};

    this.data.contacts = []
    if (this.data.conversations) {
      this.data.contacts = this.data.conversations.map(conv => conv.contact)
    }
  }

  static login (loginData) {
    return User.post('/users/login', loginData)
      .then(data =>
        new CurrentUser(data)
      )
  }

  static signup (userData) {
    return User.post('/users/create', userData)
      .then(data =>
        new CurrentUser(data)
      )
  }

  listen () {
    if (!this.socket) {
      const prefix = process.env.NODE_ENV === 'development' ?
        'http://localhost:3001' : '';
      this.socket = io(`${prefix}/?token=${this.data.jwt}`);
    }

    this.socket.on('new message', data => {
      this.callbacks['new message'].forEach(cb => {
        cb(data)
      });
    });
    this.socket.on('marked seen', data => {
      this.callbacks['marked seen'].forEach(cb => {
        cb(data);
      });
    });
  }

  addListener (eventName, cb) {
    if (!this.callbacks[eventName]) {
      this.callbacks[eventName] = [];
    }
    this.callbacks[eventName].push(cb);

    if (!this.socket) {
      this.listen()
    }
  }

  sendMessage (body, receiverId) {
    const data = {
      body,
      receiverId
    }
    return new Promise(resolve => {
      this.socket.emit('chat message', data, resolve)
    })
  }

  getContacts () {
    return CurrentUser.get('/users/contacts', {
      headers: {
        'Authorization': `Bearer ${this.data.jwt}`
      }
    })
      .then(contacts => this.data.contacts = contacts)
  }

  addContact (userId) {
    return CurrentUser.post('/users/add-contact', { userId }, {
      headers: {
        'Authorization': `Bearer ${this.data.jwt}`
      },
    })
      .then(user => {
        if (!this.data.contacts) {
          this.data.contacts = []
        }
        this.data.contacts.push(user)
        return user
      })
  }

  getConversation (userId) {
    return CurrentUser.get(`/users/conversation?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.data.jwt}`
      }
    })
  }

  updateUserInfo (data) {
    return CurrentUser.post('/users/update', data, {
      headers: {
        'Authorization': `Bearer ${this.data.jwt}`
      }
    })
      .then(userData => {
        this.data.username = userData.username;
        this.data.welcomeMessage = userData.welcomeMessage
        return this
      })
  }

  changeAvatar (file) {
    const formData = new FormData();
    formData.append('avatar', file, 'avatar');
    return CurrentUser.post('/users/avatar', formData, {
      headers: {
        'Authorization': `Bearer ${this.data.jwt}`
      }
    }).then(({ photoUrl }) => {
      this.data.photoUrl = photoUrl
      return photoUrl
    })
  }

  markSeen (messageId) {
    if (!this.socket) {
      this.listen()
    }

    this.socket.emit('mark seen', messageId);
  }

  getLastSeen (userId) {
    return new Promise(resolve => {
      this.socket.emit('getLastSeen', userId, resolve);
    });
  }
}
