import request from '@/utils/request'

export function getGoodsTypeById(query) {
  return request({
    url: '/goodsType/getGoodsTypeById',
    method: 'post',
    params: query
  })
}

export function getGoodsTypeList() {
  return request({
    url: '/goodsType/getGoodsTypeList',
    method: 'post'
  })
}

export function addGoodsType(query) {
  return request({
    url: '/goodsType/addGoodsType',
    method: 'post',
    params: query
  })
}

export function deleteGoodsType(query) {
  return request({
    url: '/goodsType/deleteGoodsType',
    method: 'post',
    params: query
  })
}
