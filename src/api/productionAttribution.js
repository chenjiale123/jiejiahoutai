import request from '@/utils/request'

export function getProductAttributeList() {
  return request({
    url: '/goodsAttr/getGoodsAttrList',
    method: 'post'
  })
}
