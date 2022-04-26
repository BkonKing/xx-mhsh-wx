import request from '@/utils/request.js'
import apiConfig from '@/api/config'

// 手机验证码登录
export function yzmLogin (data) {
  return request({
    url: '/ulogin/login/yzmLogin',
    method: 'post',
    noToast: true,
    data
  })
}

// 发送手机验证码
export function verifCode (data) {
  return request({
    url: '/ulogin/login/verifCode',
    method: 'post',
    data,
    headers: {
      completeData: true
    }
  })
}

// 手机密码登录
export function pwdLogin (data) {
  return request({
    url: '/ulogin/login/pwdLogin',
    method: 'post',
    noToast: true,
    data
  })
}

// 退出登录
export function outLogin () {
  return request.post('/ulogin/login/outLogin')
}

// 账户信息
export function getMyAccount () {
  return request({
    url: '/my/account/myAccount',
    method: 'get'
  })
}

// 获取邻里使用协议（已改为带参可以请求所有协议）
export function getAgreementContent (data) {
  return request({
    url: '/ulogin/agreement/neighbours_agreement',
    method: 'post',
    data
  })
}

// 所有协议列表接口
export function getAllAgreement () {
  return request({
    url: '/ulogin/agreement/allAgreement',
    method: 'get'
  })
}

// 设置游客定位信息
export function setUserPostion (data) {
  return request({
    url: '/user/user/setUserPostion',
    method: 'post',
    data
  })
}

// 取消注销账号接口
export function cancelLogout (data) {
  return request({
    url: '/user/cancel/cancel_apply',
    method: 'post',
    loading: true,
    data
  })
}

// 小程序授权登录
export function wxLogin (data) {
  return request({
    url: '/wxLogin/xcx_authorize_new',
    baseURL: `${apiConfig.baseUrl}/xcx/api/v1`,
    method: 'post',
    data
  })
}

// 获取微信绑定手机号
export function getWxMobile (data) {
  return request({
    url: '/wxLogin/xcx_mobile_token',
    baseURL: `${apiConfig.baseUrl}/xcx/api/v1`,
    method: 'post',
    noToast: true,
    data
  })
}