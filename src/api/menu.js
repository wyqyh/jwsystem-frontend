import request from '../utils/request'

export function getRouters(uid) {
    return request({
      url: 'permission/by/uid',
      method: 'post',
      params: {
        "uid": uid
      }
    })
  }