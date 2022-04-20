import {
  goApp
} from './util'
import {
  appPathToWxPath,
  tabbarPaths,
  whiteListPaths
} from './appPathToWxPath.js'

export default {
  push(data) {
    if (typeof data === 'string') {
      data = {
        path: data
      }
    }
    let {
      path: url,
      isApp,
      query,
      fail,
      ...params
    } = data
    const urls = url.split('?')
    const path = urls[0]
    // 轮播图专题页等自定义跳转页面，需将app地址转换为小程序地址
    if (isApp && url) {
      url = appPathToWxPath[path] || path
      url += url + urls[1]
    }
    if (query) {
      Object.keys(query).forEach((key) => {
        const value = `${key}=${query[key]}`
        url += url.indexOf('?') > -1 ? `&${value}` : `?${value}`
      })
    }
    const token = uni.getStorageSync('access_token')
    if (!token && !whiteListPaths.includes(path)) {
      uni.navigateTo({
        url: '/pages/index/login'
      })
      return
    }
    const routerParams = {
      url,
      fail: fail || function({
        errMsg
      }) {
        if (errMsg.indexOf('not found') > -1) {
          goApp()
        }
      },
      ...params
    }
    if (tabbarPaths.includes(url)) {
      uni.switchTab(routerParams)
      return
    }
    uni.navigateTo(routerParams)
  },
  go(num) {
    uni.navigateBack({
      delta: Math.abs(num)
    })
  }
}
