<template>
  <uni-popup ref="sign-alert" class="tf-van-popup" is-mask-click="false" @click-overlay="close">
    <view class="sign-alert-container">
      <view class="sign-alert-header">
        <image class="sign-alert-header-bg" src="@/static/main/sign-alert-bg.png" mode="aspectFill"></image>
        <text class="tf-icon tf-icon-guanbi" @click="handleClose"></text>
      </view>
      <view class="sign-alert-content">
        <view class="sign-alert-message">{{ message }}</view>
        <view class="sign-alert-text sign-mt">完成房屋认证</view>
        <view class="sign-alert-text">每天签到可得{{credits}}幸福币</view>
        <view class="sign-alert-btn" @click="cancel">
          去认证
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      message: {
        type: String,
        default: '签到成功'
      },
      credits: {
        type: [String, Number],
        default: ''
      }
    },
    data() {
      return {
        visible: this.value
      }
    },
    mounted() {
      this.operate(this.visible)
    },
    methods: {
      cancel() {
        this.handleClose()
        this.$router.push({
          path: '/pages/personage/house/attestation',
          query: {
            type: 1,
            mode: 0,
            select: 1
          }
        })
      },
      handleClose() {
        this.visible = false
      },
      operate(val) {
        if (val) {
          this.open()
        } else {
          this.close()
        }
      },
      open() {
        this.$refs['sign-alert'].open(this.type)
      },
      close() {
        this.$refs['sign-alert'].close()
        this.$emit('closed')
      },
    },
    watch: {
      value(val) {
        if (this.visible !== val) {
          this.visible = val
        }
      },
      visible(val) {
        this.$emit('input', val)
        this.operate(val)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tf-van-popup {
    background: none;
  }

  .sign-alert-container {
    width: 498rpx;
    height: 480rpx;
    border-radius: 12rpx;
    background-color: #fff;
  }

  .sign-alert-header {
    position: relative;
    width: 498rpx;
    height: 133rpx;
    
    &-bg {
      width: 100%;
      height: 100%;
      position: absolute;
    }

    .tf-icon {
      position: absolute;
      top: 20rpx;
      right: 20rpx;
      padding: 10rpx;
      line-height: 1;
      font-size: 30rpx;
      color: #fff;
    }
  }

  .sign-alert-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .sign-alert-message {
      margin-top: 52rpx;
      font-size: 28rpx;
      font-weight: bold;
      line-height: 1;
      color: #ff6555;
    }

    .sign-alert-text.sign-mt {
      margin-top: 43rpx;
    }

    .sign-alert-text {
      margin-top: 20rpx;
      font-size: 28rpx;
      font-weight: 500;
      line-height: 1;
      color: #000000;
    }
  }

  .sign-alert-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300rpx;
    height: 72rpx;
    margin-top: 45rpx;
    border-radius: 36rpx;
    font-size: 28rpx;
    color: #fff;
    background-color: #FF6555;
  }
</style>
