import Vue from 'vue'
import Vuex from 'vuex'
import {
  outLogin,
  getMyAccount,
  wxLogin
} from '@/api/user.js'
import {
  bindingHouse
} from '@/api/personage.js'
import {
  clearUserInfo
} from '@/utils/util'

Vue.use(Vuex)

const store = {
  state: {
    userInfo: '',
    openId: uni.getStorageSync('openid') || '',
    current_project: uni.getStorageSync('currentProject') || null,
    mobileInfo: '',
    tempData: null,
    loginModal: false,
    wxCode: ''
  },
  mutations: {
    setUserInfo(state, value) {
      const val = (value && typeof value === 'string') ? JSON.parse(value) :
        value
      state.userInfo = val
      uni.setStorageSync('userInfo', val)
    },
    setOpenId(state, value) {
      state.openId = value
      uni.setStorageSync('openId', value)
    },
    setCurrentProject(state, obj) {
      state.current_project = obj
      uni.setStorageSync('currentProject', obj);
    },
    setMobileInfo(state, value) {
      state.mobileInfo = value
    },
    setTempData(state, value) {
      state.tempData = value
    },
    setLoginModal(state, value) {
      state.loginModal = value
    },
    setWxCode(state, value) {
      state.wxCode = value
    }
  },
  getters: {
    userInfo(state) {
      return state.userInfo
    },
    currentProject(state) {
      return state.current_project
    },
    userType(state) {
      return state.userInfo.user_type || 0
    }
  },
  actions: {
    async outLogin({
      commit
    }) {
      return await new Promise((resolve, reject) => {
        uni.showLoading({
          title: '加载中'
        });
        outLogin().then((res) => {
          uni.hideLoading()
          if (res.success) {
            clearUserInfo()
            resolve()
          } else {
            reject(res)
          }
        }).catch(() => {
          uni.hideLoading()
        })
      })
    },
    async getHouse({
      commit
    }) {
      await bindingHouse().then(({
        data
      }) => {
        data && commit('setCurrentProject', data[0])
      }).catch(err => {
        console.log(err)
      })
    },
    // 刷新用户信息
    getMyAccount({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getMyAccount().then(({
          data
        }) => {
          commit('setUserInfo', data && data.user_info)
          let userList = uni.getStorageSync('userList') || {}
          userList = typeof userList === 'string' ? JSON.parse(
            userList) : userList
          userList[data.user_info.id] = data.user_info
          uni.setStorageSync('userList', userList);
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getWxLoginCode({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        uni.checkSession({
          success(message) {
            console.log(message)
            resolve(state.wxCode)
          },
          fail() {
            uni.login({
              success(res) {
                const {
                  code
                } = res
                commit('setWxCode', code)
                resolve(code)
              }
            })
          }
        })
      })
    },
    wxLogin({
      commit
    }) {
      return new Promise((resolve, reject) => {
        uni.login({
          success(res) {
            const {
              code
            } = res
            if (code) {
              //发起网络请求
              wxLogin({
                xcx_code: code
              }).then(({
                data
              }) => {
                commit('setOpenId', data.openid)
                resolve(data)
              })
            } else {
              console.log('登录失败！' + res.errMsg);
              reject(res.errMsg)
            }
          }
        });
      })
    }
  }
}

export default new Vuex.Store(store)
