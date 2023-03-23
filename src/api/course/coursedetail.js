import request from "../../utils/request"

export function addCourseDetail(params) {
  return request({
    url: '/coursedetail/add',
    method: 'post',
    data: params
  })
}