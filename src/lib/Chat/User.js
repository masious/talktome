import ChatApi from './ChatApi'

export default class User extends ChatApi {
  constructor (data) {
    super(...arguments)

    this.data = data
  }
}
