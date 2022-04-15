import App from './App'
import store from './store'
import * as filters from './filters'

// #ifndef VUE3
import Vue from 'vue'

import {
  goApp
} from './utils/util'

Vue.config.productionTip = false

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.prototype.$router = {
  push(data) {
    if (typeof data === 'string') {
      uni.navigateTo({
        url: data
      })
      return
    }
    let {
      path: url,
      query,
      fail,
      ...params
    } = data
    if (query) {
      Object.keys(query).forEach((key) => {
        const value = `${key}=${query[key]}`
        url += url.indexOf('?') > -1 ? `&${value}` : `?${value}`
      })
    }
    uni.navigateTo({
      url,
      fail: fail || function({
        errMsg
      }) {
        if (errMsg.indexOf('not found') > -1) {
          goApp()
        }
      },
      ...params
    })
  },
  go(num) {
    uni.navigateBack({
      delta: Math.abs(num)
    })
  }
}
App.mpType = 'app'
const app = new Vue({
  store,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
