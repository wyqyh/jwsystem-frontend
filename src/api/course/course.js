import request from "../../utils/request"

export function listCourse(params) {
  return request({
    url: '/course/list',
    method: 'post',
    data: params
  })
}

export function getCoursename() {
  return request({
    url: '/course/name',
    method: 'get'
  })
}

export function addCourse(data) {
  return request({
    url: '/course/add',
    method: 'post',
    data: data
  })
}