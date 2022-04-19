<template>
  <view class="tf-bg-white">
    <uni-nav-bar
      :fixed="true"
      :border="false"
      statusBar="true"
      left-icon="left"
      @click-left="$router.go(-1)"
    ></uni-nav-bar>
    <view>
      <view class="tf-h3 tf-row-justify-center">
        {{ updateStatus ? '修改' : '设置' }}支付密码
      </view>
      <view
        v-if="updateStatus && steps === 1"
        class="tf-text-lg tf-row-justify-center"
      >
        请输入支付密码，以验证身份
      </view>
      <view v-else class="tf-text-lg tf-row-justify-center">
        请设置支付密码，用于支付验证
      </view>
      <view class="item">
        <!-- 旧密码 -->
        <template v-if="updateStatus && steps === 1">
          <tf-password-input
            v-model="old_paypassword"
            @input="validPassword"
          />
        </template>
        <template v-else>
          <tf-password-input
            v-model="paypassword"
            @input="setPassword"
          />
        </template>
      </view>
      <view
        v-if="updateStatus"
        class="tf-row-justify-center forget-btn"
        @click="goForget"
      >
        忘记支付密码
      </view>
    </view>
  </view>
</template>
<script>
import TfPasswordInput from '@/components/TfPasswordInput/index';
import {
  setPayPassword,
  updatePayPassword,
  yzPayPassword
} from '@/api/personage';
export default {
  components: {
    TfPasswordInput
  },
  data() {
    return {
      updateStatus: undefined, // 是否为修改状态
      steps: 1, // 步骤，1为设置，2为忘记密码后设置
      forgetStatus: 0, // 是否忘记密码后状态
      paypassword: '', // 输入的密码
      old_paypassword: '' // 旧密码
    };
  },
  onLoad(options) {
    const { status, forget, steps } = options;
    console.log(options);
    this.updateStatus = parseInt(status);
    this.forgetStatus = parseInt(forget);
    this.steps = parseInt(steps) || 1;
  },
  methods: {
    // 验证密码
    validPassword() {
      this.old_paypassword = this.old_paypassword.slice(0, 6);
      if (this.old_paypassword.length === 6) {
        yzPayPassword({
          old_paypassword: this.old_paypassword
        }).then(res => {
          this.steps = 2;
        });
      }
    },
    // 判断修改还是设置密码
    setPassword() {
      this.paypassword = this.paypassword.slice(0, 6);
      if (this.paypassword.length === 6) {
        if (this.updateStatus || this.forgetStatus) {
          this.updatePayPassword();
        } else {
          this.setPayPassword();
        }
      }
    },
    // 修改支付密码
    updatePayPassword() {
      updatePayPassword({
        paypassword: this.paypassword
      }).then(res => {
        this.successCallback('支付密码修改成功');
      });
    },
    // 设置支付密码
    setPayPassword() {
      setPayPassword({
        paypassword: this.paypassword
      }).then(res => {
        this.successCallback('支付密码设置成功');
        this.$store.dispatch('getMyAccount');
      });
    },
    // 操作成功后回调
    successCallback(title) {
      uni.showModal({
        title,
        success: res => {
          if (res.confirm) {
            if (this.steps === 2 && this.forgetStatus) {
              this.$router.go(-3);
            } else {
              this.$router.go(-1);
            }
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    // 跳转到忘记密码
    goForget() {
      this.$router.push({
        path: '/pages/personage/information/forgetCode',
        query: {
          type: 1
        }
      });
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
}
.tf-h3 {
  margin-top: 80rpx;
  margin-bottom: 40rpx;
  font-size: 52rpx;
  font-weight: bold;
}
.tf-text-lg {
  margin-bottom: 100rpx;
}
.forget-btn {
  margin-top: 60rpx;
  font-size: 24rpx;
  color: #8f8f94;
  text-decoration: underline;
}
</style>
