import request from "../../utils/request"

export function addType(data) {
  return request({
    url: '/type/add',
    method: 'post',
    params: data
  })
}

export function getAllType() {
  return request({
    url: '/type/get',
    method: 'get'
  })
}

export function deleteTypeByIds(data) {
  return request({
    url: '/type/delete',
    method: 'post',
    data: data
  })
}

export function addTypeData(data) {
  return request({
    url: '/type/data/add',
    method: 'post',
    params: data
  })
}

export function getTypeDataByTypeids(data) {
  return request({
    url: '/type/data/get',
    method: 'post',
    data: data
  })
}

export function deleteTypeDataByIds(data) {
  return request({
    url: '/type/data/del',
    method: 'post',
    data: data
  })
}

export function updateTypeDataById(data) {
  return request({
    url: '/type/data/update',
    method: 'post',
    params: data
  })
}

export function getTypeDataByTypeno(data) {
  return request({
    url: '/type/data/get/typeno',
    method: 'post',
    params: data
  })
}

export function getTypeDataByTypenos(data) {
  return request({
    url: '/type/data/get/typenos',
    method: 'post',
    data: data
  })
}