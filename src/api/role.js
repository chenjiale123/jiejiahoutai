import request from '@/utils/request'

export function getRoles() {
  return request({
    url: '/role/findAll',
    method: 'get'
  })
}

export function getRoutes() {
  return request({
    url: '/menu/findAll',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/role/addRole',
    method: 'post',
    data
  })
}

export function getRoutesByRoleId(id) {
  return request({
    url: '/role/findMenuByRole',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function deleteRole(data) {
  return request({
    url: '/role/deleteRole',
    method: 'post',
    data
  })
}
