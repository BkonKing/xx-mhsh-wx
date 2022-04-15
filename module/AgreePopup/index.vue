<template>
  <tf-dialog
    v-model="visible"
    class="agree-popup"
    title="请阅读并同意以下协议"
    closeIconType="hidden"
    :showCancel="false"
    @confirm="handleAgree"
  >
    <view class="agree-popup-content">
      为保障您的个人信息安全，使用登录功能需要您先仔细阅读并勾选下方
      <navigator class="agreement-link" url="/pages/index/agreement?articleType=1">
        《{{ userAgreementTitle }}》
      </navigator>
      <navigator class="agreement-link" url="/pages/index/agreement?articleType=6">
        《{{ privacyAgreementTitle }}》
      </navigator>
    </view>
    <template v-slot:footer>
      <view class="agree-popup-text" @click="close">
        不同意
      </view>
    </template>
  </tf-dialog>
</template>

<script>
import TfDialog from '@/components/TfDialog/index.vue';
import { getAllAgreement } from '@/api/user';

export default {
  name: 'agree-popup',
  components: {
    TfDialog
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: this.value,
      userAgreementTitle: '用户协议', // 用户协议标题
      privacyAgreementTitle: '隐私协议' // 隐私协议标题
    };
  },
  watch: {
    visible(val) {
      this.$emit('input', val);
    },
    value(val) {
      this.visible = val;
    }
  },
  created() {
    this.getAllAgreement();
  },
  methods: {
    // 获取协议名称
    getAllAgreement() {
      getAllAgreement().then(({ data }) => {
        data.forEach(obj => {
          obj.article_type === '1' && (this.userAgreementTitle = obj.title);
          obj.article_type === '6' && (this.privacyAgreementTitle = obj.title);
        });
      });
    },
    // 同意协议
    handleAgree() {
      this.$emit('handleAgree');
      this.visible = false;
    },
    close() {
      this.visible = false
    }
  }
};
</script>

<style lang="scss" scoped>
  .agree-popup {
    &-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #000000;
      line-height: 1;
    }
    &-content {
      font-size: 28rpx;
      font-weight: 500;
      color: #000000;
      line-height: 44rpx;
      navigator {
        color: #00a0e9;
      }
    }
    &-btn {
      height: 88rpx;
      font-size: 28rpx;
      margin-top: 52rpx;
    }
    &-text {
      margin-top: 34rpx;
      font-size: 24rpx;
      text-align: center;
      color: #8f8f94;
    }
  }
</style>
