import request from '@/utils/request'

export function getGoodsList(data) {
  return request({
    url: '/goods/getGoodsList',
    method: 'post',
    data: data,
    transformRequest: [function(data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function deleteGoods(data) {
  return request({
    url: '/goods/deleteGoods',
    method: 'post',
    data: data,
    transformRequest: [function(data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function addGoods(data) {
  return request({
    url: '/goods/addGoods',
    method: 'post',
    data: data
  })
}

export function updateGoods(data) {
  return request({
    url: '/goods/updateGoods',
    method: 'post',
    data: data
  })
}

export function getGoodsById(query) {
  return request({
    url: '/goods/getGoodsById',
    method: 'post',
    params: query
  })
}
