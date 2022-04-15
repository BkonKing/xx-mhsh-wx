<template>
  <view class="tf-bg-white">
    <uni-nav-bar
      :fixed="true"
      :border="false"
      statusBar="true"
      left-icon="left"
      @click-left="$router.go(-1)"
    ></uni-nav-bar>
    <view class="tf-body-container">
      <view class="tf-text-lg tf-row-justify-center">
        我们已经发送了验证码到你的手机
      </view>
      <view class="tf-h3 tf-row-justify-center">{{ userInfo.mobile }}</view>
      <view class="tf-phone-input-box tf-row-justify-between">
        <view class="tf-phone-input-label">验证码</view>
        <input
          v-model="code"
          class="form-input tf-flex-1"
          type="digit"
          maxlength="4"
        />
        <van-count-down
          v-if="codeStatus"
          format="ss 秒"
          :time="countDownTime"
          @finish="countFinish"
        />
        <button v-else class="tf-phone-code-btn" @click="verifCode">
          获取验证码
        </button>
      </view>
      <button class="tf-btn-primary" @click="next">下一步</button>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import { verifCode, getMyAccount } from '@/api/user';
import { resetPayPassword, resetPassword } from '@/api/personage';

export default {
  name: 'forgetCode',
  data() {
    return {
      code: '',
      codeStatus: false,
      countDownTime: 60000,
      countCopy: 60,
      codeTime: 0,
      type: 0 // 0：登录密码 1：支付密码
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  onLoad(options) {
    this.type = parseInt(options.type);
  },
  onShow() {
    // this.isCountDown()
  },
  methods: {
    // 判断是否存在倒计时
    isCountDown() {
      getMyAccount().then(res => {
        if (this.codeTime) {
          const time =
            this.countCopy - Math.ceil((res.timestamp - this.codeTime) / 1000);
          if (time >= 0) {
            this.codeTime = res.timestamp;
            this.countCopy = time;
            this.countDownTime = time * 1000;
            this.codeStatus = true;
            return;
          }
        }
        this.verifCode();
      });
    },
    // 获取验证码
    verifCode() {
      // this.codeTime = new Date().getTime();
      // this.codeStatus = true;
      verifCode({
        mobile: this.userInfo.mobile
      }).then(res => {
        this.codeTime = new Date(res.header.Date).getTime();
        this.codeStatus = true;
      });
    },
    // 下一步验证
    next() {
      this.type ? this.resetPayPassword() : this.resetPassword();
    },
    // 通过验证码重置支付密码
    resetPayPassword() {
      resetPayPassword({
        mobile: this.userInfo.mobile,
        yzm: this.code
      }).then(res => {
        this.$router.push({
          path: '/pages/personage/information/paymentCode',
          query: {
            steps: 2,
            forget: 1
          }
        });
      });
    },
    // 通过验证码重置登录密码
    resetPassword() {
      resetPassword({
        mobile: this.userInfo.mobile,
        yzm: this.code
      }).then(res => {
        this.$router.push({
          path: '/pages/personage/information/loginPassword',
          query: {
            steps: 2,
            forget: 1,
            opassword: res.opassword
          }
        });
      });
    },
    // 倒计时结束
    countFinish() {
      this.countDownTime = 60000;
      this.codeStatus = false;
    }
  },
  watch: {
    type() {
      this.code = '';
      this.codeStatus = false;
      this.countDownTime = 60000;
      this.countCopy = 60;
      this.codeTime = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.tf-bg-white {
  position: fixed;
  width: 100%;
  height: 100%;
  padding: 0 50rpx;
  height: 100%;
}
.tf-body-container {
  padding: 80rpx 0;
}
.tf-h3 {
  margin: 40rpx 0 74rpx;
  font-size: 52rpx;
  font-weight: bold;
}
.tf-phone-input-box {
  width: 100%;
  padding: 30rpx 0;
  margin-bottom: 100rpx;
  border-bottom: 3rpx solid #383838;
}
.tf-phone-input-label {
  width: 110rpx;
  margin-right: 50rpx;
  line-height: 86rpx;
  font-size: 34rpx;
  font-weight: bold;
  color: #333333;
}
.tf-row-justify-between {
  align-items: center;
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
