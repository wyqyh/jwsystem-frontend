import request from "../../utils/request"

export function listPermission(params) {
  return request({
    url: '/permission/all',
    method: 'post',
    params: params
  })
}

export function addPermission(params) {
  return request({
    url: '/permission/add',
    method: 'post',
    data: params
  })
}

export function updatePermission(params) {
  return request({
    url: '/permission/update',
    method: 'post',
    data: params
  })
}

export function deletePermission(permId) {
  return request({
    url: '/permission/delete/' + permId,
    method: 'get'
  })
}