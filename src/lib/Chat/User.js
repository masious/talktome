import ChatApi from './ChatApi'

export default class User extends ChatApi {
  constructor (data) {
    super(...arguments)

    this.data = data
  }

  static search(username) {
    return User.get(`/users/search?q=${username}`)
      .then(data => data.map(userData => new User(userData)));
  }
}
