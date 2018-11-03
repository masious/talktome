import axios from "axios";


export default class ChatApi {
  static endpoint = 'http://localhost:3000'

  static post (url, data, config) {
    return axios.post(`${ChatApi.endpoint}${url}`, data, config)
      .then(response => response.data)
  }

  static get (url, config) {
    return axios.get(`${ChatApi.endpoint}${url}`, config)
      .then(response => response.data)
  }
}
