<template>
  <view class="tf-bg-white">
    <uni-nav-bar :fixed="true" :border="false" statusBar="true" left-icon="left" @click-left="$router.go(-1)">
    </uni-nav-bar>
    <view class="tf-h3">{{ updateStatus ? '修改' : '设置' }}登录密码</view>
    <view class="mb140">
      <template v-if="updateStatus">
        <view class="tf-phone-input-box">
          <view class="tf-phone-input-label">原密码</view>
          <input v-model="old_password" class="tf-phone-input width400" maxlength="16" type="password" />
        </view>
        <view class="tf-phone-input-box">
          <view class="tf-phone-input-label">新密码</view>
          <input v-model="password" class="tf-phone-input width400" type="password" maxlength="16" placeholder="填写新密码"
            placeholder-class="placeholder-password width400" />
        </view>
      </template>
      <template v-else>
        <view class="tf-phone-input-box">
          <view class="tf-phone-input-label">密 码</view>
          <input v-model="password" class="tf-phone-input" type="password" maxlength="16" placeholder="填写密码" />
        </view>
      </template>
      <view class="tf-phone-input-box">
        <view class="tf-phone-input-label">确认密码</view>
        <input v-model="repassword" class="tf-phone-input width400" type="password" maxlength="16"
          placeholder="再次填写确认" />
      </view>
      <view class="text-hint">
        密码必须是8-16位的数字、字符组合(不能是纯数字)
      </view>
      <view class="forget-btn" v-if="updateStatus" @click="goForget">
        忘记原登录密码
      </view>
    </view>
    <button class="tf-btn-primary" @click="submit">完成</button>
  </view>
</template>

<script>
  import {
    setPassword,
    updatePassword,
    resetPassword
  } from '@/api/personage'

  export default {
    data() {
      return {
        updateStatus: 0, // 是否修改密码
        steps: 0,
        forgetStatus: 0, // 是否忘记密码
        password: '',
        repassword: '',
        old_password: '',
        opassword: '' // 原加密密码，忘记密码后使用
      }
    },
    onLoad(options) {
      const {status, forget, steps, opassword} = options
      this.updateStatus = parseInt(status)
      this.forgetStatus = parseInt(forget)
      this.steps = parseInt(steps)
      this.opassword = opassword
    },
    methods: {
      submit() {
        if (this.forgetStatus) {
          this.resetPassword()
        } else if (this.updateStatus) {
          this.updatePassword()
        } else {
          this.setPassword()
        }
      },
      // 重置密码
      resetPassword() {
        resetPassword({
          opassword: this.opassword,
          password: this.password,
          repassword: this.repassword
        }).then(res => {
          this.successCallback('登录密码修改成功')
        })
      },
      // 修改登录密码
      updatePassword() {
        updatePassword({
          old_password: this.old_password,
          password: this.password,
          repassword: this.repassword
        }).then((res) => {
          this.successCallback('登录密码修改成功')
        })
      },
      // 设置登录密码
      setPassword() {
        setPassword({
          password: this.password,
          repassword: this.repassword
        }).then((res) => {
          this.successCallback('登录密码设置成功')
        })
      },
      // 操作成功后回调
      successCallback(content) {
        uni.showModal({
          content,
          showCancel: false,
          success: (res) => {
            if (this.steps === 2 && this.forgetStatus) {
              this.$router.go(-3)
            } else {
              this.$router.go(-1)
            }
          }
        });
      },
      // 跳转到忘记密码
      goForget() {
        this.$router.push({
          path: '/pages/personage/information/forgetCode',
          query: {
            type: 0
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tf-bg-white {
    padding: 0 50rpx;
    height: 100%;
  }

  .tf-h3 {
    margin: 80rpx 0 60rpx;
  }

  .tf-phone-input-label {
    width: 160rpx;
  }

  .placeholder-password {
    font-size: 34rpx;
    color: $gray-7;
  }

  .text-hint {
    margin-top: 40rpx;
    font-size: 24rpx;
    color: $gray-7;
  }

  .forget-btn {
    margin-top: 40rpx;
    font-size: 24rpx;
    color: #8f8f94;
    text-decoration: underline;
  }

  .width400 {
    width: 400rpx;
  }

  .mb140 {
    margin-bottom: 140rpx;
  }
</style>
