<template>
  <view class="sign-in-container">
    <slot></slot>
    <sign-alert
      v-model="signAlertVisible"
      :message="signMessage"
      :credits="signOwnerCredits"
    ></sign-alert>
  </view>
</template>

<script>
import SignAlert from '../SignInAlert/index';
import { handlePermission } from '@/utils/permission';
import { signin } from '@/api/personage';
export default {
  name: 'SignInCom',
  components: {
    SignAlert
  },
  props: {
    showLoading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      signAlertVisible: false, // 游客认证提醒弹窗
      signMessage: '', // 签到成功提醒
      signOwnerCredits: '' // 业主签到幸福币
    };
  },
  methods: {
    async signIn() {
      handlePermission({
        name: 'userLocation',
        title: '定位服务未开启',
        message: '为了提供更好服务，需要您开启定位'
      }).then(async () => {
        if (this.showLoading) {
          uni.showLoading({
            title: '签到中'
          });
        }
        signin()
          .then(res => {
            this.showLoading && uni.hideLoading();
            if (+res.open_box) {
              this.signMessage = res.message;
              this.signOwnerCredits = res.owner_credits;
              this.signAlertVisible = true;
            } else {
              uni.showToast({
                title: res.message,
                icon: 'none'
              });
            }
          })
          .catch(() => {
            this.showLoading && uni.hideLoading();
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
