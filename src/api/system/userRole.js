import request from "../../utils/request"

export function getRidsByUid(uid) {
  return request({
    url: '/user/role/' + uid,
    method: 'get'
  })
}

export function addUserRoles(params) {
  return request({
    url: '/user/role/add',
    method: 'post',
    data: params
  })
}
