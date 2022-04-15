<template>
  <view class="tf-bg">
    <uni-nav-bar
      title="幸福币明细"
      :fixed="true"
      :border="false"
      statusBar="true"
      left-icon="left"
      @click-left="$router.go(-1)"
    />
    <view class="tf-p-30-20">
      <userInfo :avatar="info.avatar" :name="info.username"></userInfo>
      <view class="module-box money-box">
        <view class="money-num">{{parseInt(info.credits) > 0 ? '+' : ''}}{{info.credits}}</view>
        <!-- <view class="tf-text-lg tf-text-gray-7">退款成功</view> -->
      </view>
      <view class="module-box">
        <view class="clist-item">
          <view class="clist-item__label">
            <text class="mr60">类</text>型
          </view>
          <view>{{info.title}}</view>
        </view>
        <view class="clist-item">
          <view class="clist-item__label">
            <text class="mr60">时</text>间
          </view>
          <view>{{info.ctime}}</view>
        </view>
        <view class="clist-item">
          <view class="clist-item__label">对方账户</view>
          <view>{{info.to_username}}</view>
        </view>
        <view class="clist-item">
          <view class="clist-item__label">交易单号</view>
          <view>{{info.log_no}}</view>
        </view>
        <view class="clist-item">
          <view class="clist-item__label">
            <text class="mr60">备</text>注
          </view>
          <view>{{info.source_var}}</view>
        </view>
      </view>
      <view v-if="info.jy_type === '5'" class="module-box">
        <view class="tf-row-justify-between" @click="goOrderDefail">
          <view>任务详情</view>
          <text class="tf-icon tf-icon-right"></text>
        </view>
      </view>
      <view v-else-if="info.jy_type != '0'" class="module-box">
        <view class="clist-item">
          <view class="clist-item__label">商品说明</view>
          <view class="tf-ellipsis">{{info.sp_description}}</view>
        </view>
        <view class="tf-row-justify-between divider-box" @click="goOrderDefail">
          <view>订单详情</view>
          <text class="tf-icon tf-icon-right"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import userInfo from '@/components/UserInfo/index.vue'
import { getCreditsInfo } from '@/api/personage'
export default {
  components: {
    userInfo
  },
  data () {
    return {
      id: '',
      info: {}
    }
  },
  onLoad (options) {
    this.id = options.id
    this.getCreditsInfo()
  },
  methods: {
    // 幸福币交易详情
    getCreditsInfo () {
      getCreditsInfo({
        logId: this.id
      }).then(res => {
        this.info = res.data
      })
    },
    goOrderDefail () {
      const { order_id } = this.info
      let path = ''
      switch (this.info.jy_type) {
        case '1':
          path = `/order/refund-detail?type=1&id=${order_id}`
          break
        case '2':
          path = `/order/refund-detail?type=2&id=${order_id}`
          break
        case '3':
          if (this.info.order_type == 1) {
            path = `/order/coin-detail?id=${order_id}`
          } else if (this.info.order_type == 2) {
            path = `/order/special-detail?id=${order_id}`
          } else {
            path = `/personage/shop/couponDetail?id=${order_id}`
          }
          break
        case '4':
          path = `/life/movie/ticket?id=${order_id}`
          break
        case '5':
          path = `/pages/task/detail?taskId=${order_id}`
          break
      }
      this.$router.push({
        path
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.tf-p-30-20 {
  padding: 20rpx;
}
.module-box {
  border-radius: 10rpx;
  background: #fff;
  padding: 30rpx;
  margin-top: 30rpx;
  .clist-item {
    display: flex;
    font-size: 30rpx;
    &__label {
      margin-right: 40rpx;
      color: #8f8f94;
    }
  }
  .clist-item + .clist-item {
    margin-top: 15rpx;
  }
  .tf-ellipsis {
    flex: 1;
  }
}
.money-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx;
  .money-num {
    font-size: 72rpx;
    font-weight: 500;
  }
}
.mr60 {
  margin-right: 60rpx;
}
.tf-row-justify-between {
  align-items: center;
  font-size: 30rpx;
}
.divider-box {
  margin-top: 30rpx;
  padding-top: 30rpx;
  border-top: 2rpx solid #f0f0f0;
}
</style>
