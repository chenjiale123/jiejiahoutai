import request from '@/utils/request'

export function getCouponList() {
  return request({
    url: '/coupon/getCouponList',
    method: 'post'
  })
}

export function addCoupon(query) {
  return request({
    url: '/coupon/addCoupon',
    method: 'post',
    params: query
  })
}

export function getCouponById(query) {
  return request({
    url: '/coupon/getCouponById',
    method: 'post',
    params: query
  })
}

export function updateCoupon(query) {
  return request({
    url: '/coupon/updateCoupon',
    method: 'post',
    params: query
  })
}

export function deleteCoupon(query) {
  return request({
    url: '/coupon/deleteCoupon',
    method: 'post',
    params: query
  })
}
