import request from '@/utils/request.js'

// 常见问题列表
export function getEqList (params) {
  return request({
    url: '/my/server/getEqList',
    method: 'get',
    params
  })
}

/* 意见反馈 start */
// 意见反馈列表
export function getFeedbackList (params) {
  return request({
    url: '/my/server/getFeedbackList',
    method: 'get',
    params
  })
}

// 添加意见反馈
export function addFeedback (data) {
  return request({
    url: '/my/server/addFeedback',
    method: 'post',
    data
  })
}

// 意见反馈详情
export function getFeedbackInfo (params) {
  return request({
    url: '/my/server/getFeedbackInfo',
    method: 'get',
    params
  })
}
/* 意见反馈 end */

/* 支付密码 start */
// 设置支付密码
export function setPayPassword (data) {
  return request({
    url: '/my/password/setPayPassword',
    method: 'post',
    data
  })
}

// 设置支付密码
export function yzPayPassword (data) {
  return request({
    url: '/my/password/yzPayPassword',
    method: 'post',
    data
  })
}

// 修改支付密码
export function updatePayPassword (data) {
  return request({
    url: '/my/password/updatePayPassword',
    method: 'post',
    data
  })
}

// 通过验证码重置支付密码
export function resetPayPassword (data) {
  return request({
    url: '/my/password/resetPayPassword',
    method: 'post',
    data
  })
}
/* 支付密码 end */

/* 登录密码 start */
// 通过验证码重置登录密码
export function resetPassword (data) {
  return request({
    url: '/my/password/resetPassword',
    method: 'post',
    data
  })
}

// 设置登录密码
export function setPassword (data) {
  return request({
    url: '/my/password/setPassword',
    method: 'post',
    data
  })
}

// 设置登录密码
export function updatePassword (data) {
  return request({
    url: '/my/password/updatePassword',
    method: 'post',
    data
  })
}
/* 登录密码 end */

/* 成员 start */
// 成员列表
export function getMemberList (params) {
  return request({
    url: '/room/binding/memberList',
    method: 'get',
    params
  })
}

// 新增报备成员
export function addMember (data) {
  return request({
    url: '/my/member/addMember',
    method: 'post',
    data
  })
}

// 修改报备成员
export function updateMember (data) {
  return request({
    url: '/my/member/updateMember',
    method: 'post',
    data
  })
}

// 删除报备成员
export function deleteMember (data) {
  return request({
    url: '/my/member/deleteMember',
    method: 'post',
    data
  })
}
/* 成员 end */

/* 房产 start */
// 房产信息
export function bindingHouse (params) {
  return request({
    url: '/room/binding/bindingHouse',
    method: 'get',
    params
  })
}

// 业主房产信息接口
export function yzHouse (params) {
  return request({
    url: '/room/binding/yzHouse',
    method: 'get',
    params
  })
}

// 房间认证
export function roomAttest (data) {
  return request.post('/room/binding/roomAttest', data)
}

/* 认证房间详情 */
export function bindingRoomInfo (params) {
  return request({
    url: '/room/binding/bindingRoomInfo',
    method: 'get',
    params
  })
}

/* 设置当前房间 */
export function bindingDefault (data) {
  return request({
    url: '/room/binding/bindingDefault',
    method: 'post',
    data
  })
}

/* 解除绑定房间 */
export function unBinding (data) {
  return request.post('/room/binding/unBinding', data)
}

/* 检索小区 */
export function searchProject (params) {
  return request.get('/room/binding/searchProject', { params })
}

/* 检索楼栋 */
export function searchBuilding (params) {
  return request.get('/room/binding/searchBuilding', { params })
}

// 检索单元
export function searchUnit (params) {
  return request({
    url: '/room/binding/searchUnit',
    method: 'get',
    params
  })
}

// 检索房屋
export function searchHouse (params) {
  return request({
    url: '/room/binding/searchHouse',
    method: 'get',
    params
  })
}
/* 房产 end */

/* 幸福币 start */
// 获取付款码二维码
export function getPaymentCode (params) {
  return request({
    url: '/credits/qrcode/paymentCode',
    method: 'get',
    params
  })
}
// 获取收款码二维码
export function getCollectCode (params) {
  return request({
    url: '/credits/qrcode/new_collectCode',
    method: 'get',
    params
  })
}
// 付款码扫码请求
export function paymentScan (data) {
  return request({
    url: '/credits/qrcode/paymentScan',
    method: 'post',
    data
  })
}
// 收款码扫码请求
export function collectScan (data) {
  return request({
    url: '/credits/qrcode/new_collectScan',
    method: 'post',
    data
  })
}
// 付款方接收付款码状态
export function paymentStatus (data) {
  return request({
    url: '/credits/qrcode/paymentStatus',
    method: 'post',
    noLoading: true,
    data
  })
}
// 收款方接收收款码状态
export function collectStatus (data) {
  return request({
    url: '/credits/qrcode/new_collectStatus',
    method: 'post',
    noLoading: true,
    data,
  })
}
// 付款码支付
export function paymentCredits (data) {
  return request({
    url: '/credits/qrcode/paymentCredits',
    method: 'post',
    data,
    headers: {
      noToast: true
    }
  })
}
// 收款码支付
export function collectCredits (data) {
  return request({
    url: '/credits/qrcode/collectCredits',
    method: 'post',
    data,
    headers: {
      noToast: true
    }
  })
}
// 收款方提交收款金额
export function skCredits (data) {
  return request({
    url: '/credits/qrcode/skCredits',
    method: 'post',
    data
  })
}
// 签到
export function signin () {
  return request.post('/credits/account/signin')
}
// 签到日历数据
export function signinCalendar (data) {
  return request({
    url: '/credits/account/signinCalendar',
    method: 'post',
    data
  })
}
// 幸福币账户首页
export function getCreditsAccount (data) {
  return request({
    url: '/credits/account/index',
    method: 'post',
    data
  })
}
// 幸福币明细
export function getCreditsLog (params) {
  return request({
    url: '/credits/account/credits_log',
    method: 'get',
    params
  })
}
// 幸福币交易详情
export function getCreditsInfo (params) {
  return request({
    url: '/credits/account/credits_info',
    method: 'get',
    params
  })
}
// 幸福币订单购买记录
export function getCreditsOrderList (data) {
  return request.post('/life/order/credits_order_list', data)
}
// 意向楼盘列表
export function getYxlpList () {
  return request({
    url: '/hkt/tjgf/yxlpList'
  })
}
// 推荐客户
export function recommendClient (data) {
  return request({
    url: '/hkt/tjgf/recommendClient',
    method: 'post',
    data
  })
}

// 推荐客户列表
export function clientList (params) {
  return request({
    url: '/hkt/tjgf/clientList',
    method: 'get',
    params
  })
}
// 统计客户
export function clientCount () {
  return request({
    url: '/hkt/tjgf/clientCount'
  })
}

/* 幸福币 end */

/* 我的消息 start */

// 获取消息列表
export function getMessageList (params) {
  return request({
    url: '/my/message/getMessageList',
    method: 'get',
    params
  })
}
// 统计未读消息
export function getCountMessage (params) {
  return request({
    url: '/my/message/countMessage',
    method: 'get',
    params
  })
}
// 消息已读
export function messageRead (data) {
  return request({
    url: '/my/message/messageRead',
    method: 'post',
    data
  })
}
// 消息全部已读
export function messageAllRead (data) {
  return request({
    url: '/my/message/messageAllRead',
    method: 'post',
    data
  })
  return request.post('/my/message/messageAllRead', data)
}
// 获取APP系统消息详情接口
export function getAppMsgDetail (data) {
  return request({
    url: '/messagepush/app/getAppDetail',
    method: 'post',
    data
  })
}

/* 我的消息 end */

/* 基础信息 start */

// 编辑头像
export function editAvatar (data) {
  return request.post('/my/account/editAvatar', data)
}
// 编辑昵称
export function editNickname (data) {
  return request.post('/my/account/editNickname', data)
}
// 编辑性别
export function editGender (data) {
  return request.post('/my/account/editGender', data)
}
// 编辑生日
export function editBirthday (data) {
  return request.post('/my/account/editBirthday', data)
}
// 编辑真实姓名
export function editRealname (data) {
  return request.post('/my/account/editRealname', data)
}
// 更换手机
export function updateMobile (data) {
  return request.post('/my/password/updateMobile', data)
}
/* 基础信息 end */

/* 生活 start */

// 优惠券
export function getCoupon (data) {
  return request({
    url: '/life/my_order/coupon_list',
    method: 'post',
    data
  })
}

// 创建优惠券订单
export function payOrderUp (data) {
  return request({
    url: '/life/order/pay_order',
    method: 'post',
    data
  })
}

// 订单列表
export function getOrderList (data) {
  return request({
    url: '/life/my_order/my_order_list',
    method: 'post',
    data
  })
}

// 订单详情
export function getOrderDetail (data) {
  return request({
    url: '/life/my_order/order_project_info',
    method: 'post',
    data
  })
}

/* 生活 end */