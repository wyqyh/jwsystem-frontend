import request from "../../utils/request"

export function treeselect() {
  return request({
    url: '/permission/all',
    method: 'post'
  })
}