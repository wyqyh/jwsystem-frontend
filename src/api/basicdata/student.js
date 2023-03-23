import request from "../../utils/request"

export function uploadStuinfo(data) {
  return request({
    url: '/stu/upload',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data: data
  })
}

export function pageGetStudent(data) {
  return request({
    url: '/stu/list',
    method: 'post',
    data: data
  })
}