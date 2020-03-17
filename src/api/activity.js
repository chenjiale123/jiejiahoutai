import request from '@/utils/request'

export function getActivitylist() {
  return request({
    url: '/activity/getActivitylist',
    method: 'post'
  })
}

export function addActivity(query) {
  return request({
    url: '/activity/addActivity',
    method: 'post',
    params: query
  })
}

export function getActivityById(query) {
  return request({
    url: '/activity/getActivityById',
    method: 'post',
    params: query
  })
}
export function deleteActivity(query) {
  return request({
    url: '/activity/deleteActivity',
    method: 'post',
    params: query
  })
}

export function updateActivity(query) {
  return request({
    url: '/activity/updateActivity',
    method: 'post',
    params: query
  })
}
