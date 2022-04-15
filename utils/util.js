import store from '../store'

/**
 * 获取当前地址信息
 * @param {type} 1：返回转换为详细地址信息（省市县），2：返回 getLocation获取到信息
 * @return {Promise} 根据type返回不同格式的地址信息
 */
export function bMapGetLocationInfo(type = 1) {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        resolve(res)
      },
      fail() {
        reject()
      }
    })
  })
}

export function clearUserInfo() {
  const userId = store.getters.userInfo.id
  if (userId) {
    // let tokenList = uni.getStorageSync('token_list')
    // tokenList = typeof tokenList === 'string' ? JSON.parse(tokenList) :
    //   tokenList
    // delete tokenList[userId]
    // uni.setStorageSync('token_list', tokenList)
    let userList = uni.getStorageSync('userList')
    console.log(userList);
    userList = typeof userList === 'string' ? JSON.parse(userList) : userList
    delete userList[userId]
    uni.setStorageSync('userList', userList)
  }
  uni.removeStorageSync('userInfo')
  store.commit('setUserInfo', '')
  store.commit('setCurrentProject', null)
  uni.removeStorageSync('access_token')
  uni.removeStorageSync('refresh_token')
  uni.removeStorageSync('currentProject')
}

export function getDate(time) {
  const date = time || new Date()
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  month = month > 9 ? month : '0' + month
  day = day > 9 ? day : '0' + day
  return `${year}/${month}/${day}`
}

export function validForm(arr) {
  const status = arr.some(obj => {
    return validEmpty(obj.value, obj.message)
  })
  return new Promise((resolve, reject) => {
    if (!status) {
      resolve(status)
    } else {
      reject(status)
    }
  })
}

export function validEmpty(val, message) {
  const status = typeof val === 'undefined' || val === null || val === ''
  if (status) {
    uni.showToast({
      title: message || '值不能为空',
      icon: 'none'
    })
  }
  return status
}

export function requestPayment(data) {
  return new Promise((resolve, reject) => {
    uni.requestPayment({
      provider: 'wxpay',
      ...data,
      success: function(res) {
        resolve(res)
      },
      fail: function(err) {
        reject(err)
      }
    });
  })
}

export function goApp(data) {
  uni.showModal({
    content: '前往美好生活家园APP体验',
    confirmText: '我知道了',
    showCancel: false,
    success: function(res) {
      if (res.confirm) {} else if (res.cancel) {}
    }
  });
}

export function chooseImage(params) {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      ...params,
      success: function(chooseImageRes) {
        const tempFilePaths = chooseImageRes.tempFilePaths;
        const remoteData = []
        if (tempFilePaths && tempFilePaths.length) {
          const result = tempFilePaths.map((filePath, index) => {
            return uploadImage(filePath, index).then((url) => {
              url && (remoteData[index] = url)
            });
          });
          Promise.all(result).then(() => {
            if (params.count === 1) {
              resolve(remoteData[0])
              return
            }
            resolve(remoteData)
          })
        }
      },
      fail: function(error) {
        reject(error)
      }
    })
  })
}

export function uploadImage(filePath, index) {
  const baseUrl = 'https://develop.mhshjy.com';
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${baseUrl}/app/api/v1/ulogin/login/upload_img`,
      filePath,
      name: 'img',
      formData: {
        num: index,
        uid: 1
      },
      header: {
        'Content-Type': 'multipart/form-data',
        accept: 'application/json',
        Authorization: uni.getStorageSync('access_token')
      },
      success: ({
        data
      }) => {
        data = data.replace(' ', '');
        if (typeof data !== 'object') {
          data = data.replace(/\ufeff/g, '');
          data = JSON.parse(data);
        }
        const result = baseUrl + data.data
        resolve(result)
      },
      fail: function() {
        resolve()
      }
    });
  })
}
