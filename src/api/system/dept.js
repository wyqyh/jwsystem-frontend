import request from "../../utils/request"

export function addDept(params) {
  return request({
    url: '/dept/add',
    method: 'post',
    data: params
  })
}

export function updateDept(params) {
    return request({
      url: '/dept/update',
      method: 'post',
      data: params
    })
  }

  export function delDept(deptId) {
    return request({
      url: '/dept/delete/' + deptId,
      method: 'get'
    })
  }

  export function getDept(deptName) {
    return request({
      url: '/dept/get',
      method: 'post',
      params: deptName
    })
  }