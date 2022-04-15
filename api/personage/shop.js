import request from '@/utils/request.js'

// 商铺 店铺信息数据 接口
export function getShopInformation (data) {
  return request({
    url: '/shops/shops_coupon/shops_see_info',
    method: 'post',
    data
  })
}

// 商铺券 banner条 接口
export function getShopCouponBanner (data) {
  return request({
    url: '/shops/shops_coupon/shops_coupon_banner_data',
    method: 'post',
    data
  })
}

// 商铺券 可领取列表 接口
export function getCouponReceiveList (data) {
  return request({
    url: '/shops/shops_coupon/shops_coupon_receive_list',
    method: 'post',
    data
  })
}

// 领取 商铺 优惠券 接口
export function receiveCoupon (data) {
  return request({
    url: '/shops/shops_coupon/receive_shops_coupon',
    method: 'post',
    data
  })
}
