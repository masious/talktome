import User from './User';

export default class CurrentUser extends User {
  constructor(props) {
    super(props);

    this.callbacks = {};

    this.data.contacts = [];
    if (this.data.conversations) {
      this.data.contacts = this.data.conversations.map(conv => conv.contact);
    }
  }

  static login(loginData) {
    return User.post('/users/login', loginData);
  }

  static signup(userData) {
    return User.post('/users/create', userData);
  }

  static getContacts(jwt) {
    return CurrentUser.get('/users/contacts', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  }

  static addContact(jwt, userId) {
    return CurrentUser.post('/users/add-contact', { userId }, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  }

  static getConversation(jwt, userId) {
    return CurrentUser.get(`/users/conversation?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  }

  static changeAvatar(jwt, file) {
    const formData = new FormData();
    formData.append('avatar', file, 'avatar');
    return CurrentUser.post('/users/avatar', formData, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  }

  static search(jwt, username) {
    return User.get(`/users/search?q=${username}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  }
}
