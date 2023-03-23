import request from "../../utils/request"

export function addClassroom(params) {
  return request({
    url: '/classroom/add',
    method: 'post',
    data: params
  })
}

export function updateClassroom(params) {
  return request({
    url: '/classroom/update',
    method: 'post',
    data: params
  })
}

export function deleteClassroom(params) {
  return request({
    url: '/classroom/delete',
    method: 'post',
    data: params
  })
}

export function listClassroom(params) {
  return request({
    url: '/classroom/get',
    method: 'post',
    data: params
  })
}
