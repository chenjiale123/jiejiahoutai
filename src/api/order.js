import request from '@/utils/request'

export function getAllOrder() {
  return request({
    url: '/order/getAllOrder',
    method: 'post'
  })
}
export function getOrderByOrderId(query) {
  return request({
    url: '/order/getOrderByOrderId',
    method: 'post',
    params: query
  })
}
