import ajax from '@/uni_modules/u-ajax/js_sdk'
import store from '@/store'
import qs from 'qs'
import {
	clearUserInfo
} from '@/utils/util'

const service = ajax.create({
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	baseURL: 'https://develop.mhshjy.com/app/api/v1',
	// withCredentials: true, // send cookies when cross-domain requests
	timeout: 30000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
	config => {
    !config.noLoading && uni.showLoading({
    	title: '加载中'
    });
		// 请求发送前
		const token = uni.getStorageSync('access_token')
		// 转换参数格式
		if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
			config.data = qs.stringify(config.data)
		}
		token && (config.headers['Authorization'] = token)
		if (typeof config.headers.ProjectId === 'undefined') {
			// 获取当前项目
			const project = store.getters.currentProject
			const userInfo = store.getters.userInfo
			if (project) {
				config.headers.ProjectId = project.project_id
			} else if (userInfo.project_id) {
				config.headers.ProjectId = userInfo.project_id
			}
		}
    config.header = config.headers
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// 响应拦截器
service.interceptors.response.use(
	response => {
		const {
			status,
			data,
			config
		} = response
		const {
			code,
			message
		} = data
    !config.noLoading && uni.hideLoading();
		if (status == 401 || code == 401) {
			uni.showModal({
				title: '提示',
				content: '登录信息已经过期了，请重新登录',
				success: function(res) {
					if (res.confirm) {
						clearUserInfo()
						uni.reLaunch({
							url: '/pages/index/login'
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
			return Promise.reject(code)
		} else if (code != 200) {
			if (!config.headers.noToast) {
				uni.showToast({
					title: message,
          icon: 'none',
					duration: 2000
				});
			}
			return Promise.reject(data || 'Error')
		} else {
			return config.headers.completeData ? response : data
		}
	},
	error => {
		if (error.message.includes('timeout')) {
			uni.showToast({
				title: '请求超时',
				duration: 2000
			});
		}
		return Promise.reject(error)
	}
)

export default service
