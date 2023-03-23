import request from "../../utils/request"

export function listRole(query) {
  return request({
    url: '/role/list',
    method: 'get',
    params: query
  })
}

export function addRole(params) {
  return request({
    url: '/role/add',
    method: 'post',
    data: params
  })
}

export function updateRole(params) {
  return request({
    url: '/role/update',
    method: 'post',
    data: params
  })
}

export function updateRoleStatus(params) {
  return request({
    url: '/role/status/update',
    method: 'post',
    data: params
  })
}

export function deleteRole(params) {
  return request({
    url: '/role/delete',
    method: 'post',
    data: params
  })
}

export function getRole(roleId) {
  return request({
    url: '/role/' + roleId,
    method: 'get'
  })
}