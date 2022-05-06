import request from '@/utils/request.js'
import apiConfig from '@/api/config'

// 幸运大转盘 弹窗信息 接口
export function getAwardPopupInfo (data) {
  return request({
    url: '/award/award/awardPopupInfo',
    method: 'post',
    data
  })
}

// 幸运大转盘 详情数据 接口
export function getAwardInfo (data) {
  return request({
    url: '/award/award/awardInfo',
    method: 'post',
    data
  })
}

// 抽奖接口
export function luckDraw (data) {
  return request({
    url: '/award/award/luckDraw',
    method: 'post',
    data,
    noToast: false
  })
}

// 抽奖记录列表 接口
export function getAwardLogList (data) {
  return request({
    url: '/award/award/awardLogList',
    method: 'post',
    data
  })
}

// 抽奖记录列表 单条 接口
export function getAwardLogInfo (data) {
  return request({
    url: '/award/award/awardLogInfo',
    method: 'post',
    data
  })
}