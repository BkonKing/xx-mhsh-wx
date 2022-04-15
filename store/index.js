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
    userInfo: uni.getStorage('openid') || '',
    hasLogin: false,
    loginProvider: '',
    openId: null,
    colorList: ['#FF0000', '#00FF00', '#0000FF'],
    visitorList: null,
    houseSelected: null,
    current_project: null,
    keepAliveList: ['mainIndex'],
    paddingTop: 0,
    paddingBottom: 0,
    temporaryType: undefined,
    mobile_info: '',
    map_info: '',
    share_params: '',
    groupInfo: '',
    winResize: false,
    taskFinishStatus: false,
    tempData: null,
  },
  mutations: {
    setUserInfo(state, value) {
      const val = (value && typeof value === 'string') ? JSON.parse(value) :
        value
      state.userInfo = val
      uni.setStorageSync('userInfo', val)
    },
    setVisitorList(state, list) {
      state.visitorList = list
    },
    setHouseSelected(state, obj) {
      state.houseSelected = obj
    },
    setCurrentProject(state, obj) {
      state.current_project = obj
      uni.setStorageSync('currentProject', obj);
    },
    deleteKeepAlive(state, name) {
      const index = state.keepAliveList.indexOf(name)
      if (index !== -1) {
        state.keepAliveList.splice(index, 1)
      }
    },
    clearKeepAlive(state) {
      state.keepAliveList = []
    },
    setPaddingTop(state, value) {
      state.paddingTop = value
    },
    setPaddingBottom(state, value) {
      state.paddingBottom = value
    },
    setTemporaryType(state, value) {
      state.temporaryType = value
    },
    setMobile_info(state, value) {
      state.mobile_info = value
    },
    setMap_info(state, value) {
      state.map_info = value
    },
    setShare_params(state, value) {
      state.share_params = value
    },
    setWinResize(state, value) {
      state.winResize = value
    },
    setTempData(state, value) {
      state.tempData = value
    },
    setOpenId(state, value) {
      state.openId = value
      uni.setStorageSync('openId', value)
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
    wxLogin({
      commit
    }) {
      return new Promise((resolve, reject) => {
        wx.login({
          success(res) {
            const {
              code
            } = res
            if (code) {
              //发起网络请求
              wxLogin({
                xcx_code: code
              }).then(({data}) => {
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
