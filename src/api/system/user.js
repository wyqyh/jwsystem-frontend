import request from "../../utils/request"

export function getUsers(params) {
  return request({
    url: '/user/get',
    method: 'post',
    data: params
  })
}

export function addUser(params) {
  return request({
    url: '/user/register',
    method: 'post',
    data: params
  })
}

export function registe(params) {
  return request({
    url: '/user/registe',
    method: 'post',
    data: params
  })
}

export function updateUser(params) {
  return request({
    url: '/user/update',
    method: 'post',
    data: params
  })
}

export function updatePwd(params) {
  return request({
    url: '/user/update/pwd',
    method: 'post',
    data: params
  })
}

export function delUser(params) {
  return request({
    url: '/user/del',
    method: 'post',
    data: params
  })
}

export function getByUid(uid) {
  return request({
    url: '/user/getbyid/' + uid,
    method: 'get',
  })
}

export function uploadAvatar(data) {
  return request({
    url: '/user/upload/avatar',
    headers: {'Content-Type': 'multipart/form-data'},
    method: 'post',
    data: data
  })
}

export function getTeachers() {
  return request({
    url: '/user/get/select',
    method: 'get',
  })
}