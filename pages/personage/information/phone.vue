<template>
  <view class="tf-bg-white">
    <uni-nav-bar
      :fixed="true"
      :border="false"
      statusBar="true"
      left-icon="left"
      @click-left="$router.go(-1)"
    ></uni-nav-bar>
    <view class="tf-h3">验证手机号</view>
    <view class="mb140">
      <view class="tf-phone-input-box">
        <view class="tf-phone-input-label">手机号</view>
        <input v-model="mobile" class="tf-phone-input" type="number" />
      </view>
      <view class="tf-phone-input-box tf-row-justify-between">
        <view class="tf-row-items-center tf-flex-1">
          <view class="tf-phone-input-label">验证码</view>
          <input v-model="yzm" class="form-input" type="digit">
          </input>
          <van-count-down
            v-if="codeStatus"
            :time="countDownTime"
            @finish="countFinish"
          >
            <template v-slot="{timeData}">
              <view class="tf-phone-code-btn">{{ timeData.seconds }}s</view>
            </template>
          </van-count-down>
          <button v-else class="tf-phone-code-btn" @click="verifCode">
            获取验证码
          </button>
        </view>
      </view>
    </view>
    <button class="tf-btn-primary" @click="submit">确定</button>
  </view>
</template>

<script>
import { updateMobile } from '@/api/personage'
import { verifCode } from '@/api/user'
import { validForm } from '@/utils/util'

export default {
  data () {
    return {
      mobile: '',
      yzm: '',
      codeStatus: false,
      countDownTime: 60000
    }
  },
  methods: {
    /* 获取验证码 */
    verifCode () {
      verifCode({
        mobile: this.mobile
      }).then(res => {
        this.codeStatus = true
      })
    },
    /* 确定更改 */
    submit () {
      const validator = [
        {
          value: this.mobile,
          message: '请填写手机号'
        },
        {
          value: this.yzm,
          message: '请填写验证码'
        }
      ]
      validForm(validator).then(() => {
        updateMobile({
          mobile: this.mobile,
          yzm: this.yzm
        }).then(res => {
          const that = this
          uni.showToast({
            title: '更换成功',
            icon: 'none',
            success() {
              that.$store.dispatch('getMyAccount')
              that.$router.go(-1)
            }
          })
        })
      })
    },
    /* 倒计时结束 */
    countFinish () {
      this.countDownTime = 60000
      this.codeStatus = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tf-bg-white {
  padding: 50rpx;
  height: 100%;
}

.tf-h3 {
  margin: 148rpx 0 60rpx;
}

.mb140 {
  margin-bottom: 140rpx;
}

.tf-bg-primary {
  border: none;
}

.tf-phone-input-label {
  width: 140rpx;
  margin-right: 0;
  line-height: 86rpx;
}
.tf-phone-code-btn {
  font-size: 26rpx;
  height: 66rpx;
  line-height: 66rpx;
  padding: 0 26rpx;
  margin: 0;
  border: 3rpx solid $gray-8;
  border-radius: 4rpx;
  background-color: #fff;
}
</style>
