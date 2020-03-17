import request from '@/utils/request'

export function getBannerList() {
  return request({
    url: '/banner/getBannerList',
    method: 'post'
  })
}

export function deleteBanner(query) {
  return request({
    url: '/banner/deleteBanner',
    method: 'post',
    params: query
  })
}

export function getBannerById(query) {
  return request({
    url: '/banner/getBannerById',
    method: 'post',
    params: query
  })
}

export function updateBanner(query) {
  return request({
    url: '/banner/updateBanner',
    method: 'post',
    params: query
  })
}

export function addBanner(query) {
  return request({
    url: '/banner/addBanner',
    method: 'post',
    params: query
  })
}
