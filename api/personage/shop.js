import request from '@/utils/request.js'

// 商铺 店铺信息数据 接口
export function getShopInformation (data) {
  return request({
    url: '/shops/shops_coupon/shops_see_info',
    method: 'post',
    loading: true,
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
    loading: true,
    data
  })
}

// 是否扫码核销优惠券权限 接口
export function getShopScanPermission (data) {
  return request({
    url: '/shops/shops_coupon/is_scan',
    method: 'post',
    data
  })
}

// 商铺 扫码 优惠券详情 接口
export function getScanCouponInfo (data) {
  return request({
    url: '/shops/shops_coupon/shops_coupon_scan',
    method: 'post',
    data
  })
}

// 核销商铺优惠券 接口
export function verificationCoupon (data) {
  return request({
    url: '/shops/shops_coupon/shops_coupon_operation',
    method: 'post',
    data
  })
}