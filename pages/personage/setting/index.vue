<template>
  <view>
    <uni-nav-bar
      title="设置"
      statusBar="true"
      :fixed="true"
      :border="false"
      left-icon="left"
      @click-left="goBack"
    ></uni-nav-bar>
    <view class="tf-p-30-20">
      <uni-list class="tf-uni-list" :border="false">
        <uni-list-item
          title="个人资料"
          showArrow="true"
          to="/pages/personage/information/index"
        ></uni-list-item>
        <uni-list-item
          title="隐私政策"
          showArrow="true"
          to="/pages/index/agreement?articleType=6"
        ></uni-list-item>
      </uni-list>
      <button class="out-login-btn" @click="outLogin">退出登录</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  onLoad() {},
  methods: {
    // 退出登录
    outLogin() {
      this.$store.dispatch('outLogin').then(() => {
        uni.reLaunch({
          url: '/pages/index/login',
        })
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  },
}
</script>

<style lang="scss" scoped>
.out-login-btn {
  width: 100%;
  height: 120rpx;
  line-height: 120rpx;
  font-size: 30rpx;
  margin-top: 30rpx;
  background-color: #fff;
  color: $red-dark;
}
</style>
