import request from "../../utils/request"

export function getPermissionByRoleId(roleId) {
    return request({
      url: '/rolePermission/byRoleId/' + roleId,
      method: 'get'
    })
  }