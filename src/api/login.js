import request from '../utils/request'

export function login(username, password, checkcode) {
    return request({
      url: 'user/login',
      method: 'post',
      data: {
        account: username,
        password,
        checkcode
      }
    })
  }