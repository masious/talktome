import User from './User'

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
  }

  static signup (userData) {
    return User.post('/users/create', userData)
  }

  static getContacts (jwt) {
    return CurrentUser.get('/users/contacts', {
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    })
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

  static getConversation (jwt, userId) {
    return CurrentUser.get(`/users/conversation?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${jwt}`
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

  search (username) {
    return User.get(`/users/search?q=${username}`, {
      headers: {
        'Authorization': `Bearer ${this.data.jwt}`
      }
    }).then(usersData => usersData.map(userData => new User(userData)));
  }
}
