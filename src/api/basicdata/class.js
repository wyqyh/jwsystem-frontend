import request from "../../utils/request"

export function getClassno() {
  return request({
    url: '/class/get/classno',
    methods: 'get'
  })
}

export function getClassById(cid) {
  return request({
    url: '/class/get/' + cid,
    method: 'get'
  })
}

export function addClass(data) {
  return request({
    url: '/class/add',
    method: 'post',
    data: data
  })
}

export function listClass(data) {
  return request({
    url: '/class/list',
    method: 'post',
    data: data
  })
}

export function updateClass(data) {
  return request({
    url: '/class/update',
    method: 'post',
    data: data
  })
}

export function deleteClass(data) {
  return request({
    url: '/class/delete',
    method: 'post',
    data: data
  })
}