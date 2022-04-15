<template>
  <view>
    <uni-nav-bar
      :title="title"
      :fixed="true"
      :border="false"
      statusBar="true"
      left-icon="left"
      @click-left="$router.go(-1)"
    />
    <view class="tf-main-container">
      <userInfo
        :avatar="info.avatar"
        :name="info.realname"
        :time="info.mobile"
      ></userInfo>
      <view class="payment-box">
        <view class="payment-box__text">{{ type | payText }}</view>
        <view class="payment-box__money">
          <text class="tf-icon tf-icon-xingfubi1"></text>
          <input
            v-model="value"
            class="payment-box__money-number"
            type="number"
            :disabled="type === '3'"
          />
          <text
            v-if="value && type !== '3'"
            class="tf-icon tf-icon-close-circle-fill"
            @click="value = ''"
          ></text>
        </view>
        <input
          v-model="remarks"
          class="tf-mt-20"
          :disabled="type === '3'"
          maxlength="10"
          placeholder="添加备注(10字以内)"
        />
      </view>
      <button class="tf-mt-30 tf-btn-primary" @click="handlePay">
        {{ type !== '2' ? '确认支付' : '确认' }}
      </button>
    </view>
    <tf-dialog
      v-model="payCodeShow"
      title="请输入密码"
      class="paycode-dialog"
      @confirm="payEnter"
      @closed="paypassword = ''"
    >
      <tf-password-input
        :value="paypassword"
        :gutter="10"
        :focused="showPasswordboard"
        @focus="focusPasswordInput"
      />
      <input
        v-model="paypassword"
        type="number"
        maxlength="6"
        :focus="showPasswordboard"
        style="width: 0;"
      />
    </tf-dialog>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import userInfo from '@/components/UserInfo/index';
import TfDialog from '@/components/TfDialog/index';
import TfPasswordInput from '@/components/TfPasswordInput/index';
import { paymentCredits, collectCredits, skCredits } from '@/api/personage';
export default {
  name: 'CreditPayment',
  components: {
    userInfo,
    TfDialog,
    TfPasswordInput
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  data() {
    return {
      type: '1', // 1：付款 2: 收款 3:确认付款
      title: '',
      codeId: '',
      info: {},
      value: '',
      remarks: '',
      showKeyboard: false,
      showPasswordboard: false,
      payCodeShow: false,
      paypassword: ''
    };
  },
  onLoad(options) {
    const {
      type,
      value,
      avatar,
      realname,
      mobile,
      credits,
      remarks
    } = options;
    this.type = type;
    this.codeId = value;
    this.info = { avatar, realname, mobile };
    this.title = this.type !== '2' ? '付款' : '收款';
    if (this.type === '3') {
      this.value = credits;
      this.remarks = remarks;
    }
  },
  onShow() {
    this.paypassword = '';
  },
  methods: {
    focusPasswordInput() {
      this.showPasswordboard = false
      this.$nextTick(() => {
        this.showKeyboard = true
      })
    },
    // 完成
    handlePay() {
      if (+this.value <= 0) {
        uni.showToast({
          title: '请输入金额',
          icon: 'none',
          duration: 2000
        });
        return
      }
      if (!this.userInfo.is_setpaypassword) {
        this.setPaymentPassword('您还未设置支付密码！');
        return;
      }
      if (this.type !== '2') {
        this.payCodeShow = true;
        this.showPasswordboard = false;
        this.$nextTick(() => {
          this.showPasswordboard = true;
        })
      } else {
        this.skCredits();
      }
    },
    // 输入完密码
    payEnter() {
      if (this.paypassword.length === 6) {
        if (this.type === '1') {
          this.collectCredits();
        } else if (this.type === '3') {
          this.paymentCredits();
        }
      } else {
        uni.showToast({
          title: '请输入完整密码',
          icon: 'none',
          duration: 2000
        });
      }   
    },
    // 付款码支付
    paymentCredits() {
      const params = {
        credits: this.value,
        code_id: this.codeId,
        paypassword: this.paypassword
      };
      paymentCredits(params)
        .then(res => {
          uni.showModal({
            content: '付款成功',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                this.$router.go(-1);
              }
            }
          });
        })
        .catch(({ message }) => {
          this.setPaymentPassword(message);
        });
    },
    // 收款码支付
    collectCredits() {
      const params = {
        credits: this.value,
        remarks: this.remarks,
        code_id: this.codeId,
        paypassword: this.paypassword
      };
      collectCredits(params)
        .then(res => {
          uni.showModal({
            content: '付款成功',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                this.$router.go(-1);
              }
            }
          });
        })
        .catch(({ message }) => {
          this.setPaymentPassword(message);
        });
    },
    // 收款方提交收款金额
    skCredits() {
      skCredits({
        credits: this.value,
        remarks: this.remarks,
        code_id: this.codeId
      }).then(res => {
        uni.showModal({
          content: '请等待对方确认付款',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              this.$router.go(-1);
            }
          }
        });
      });
    },
    // 设置支付密码
    setPaymentPassword(message) {
      if (message === '您还未设置支付密码！') {
        uni.showModal({
          title: '您还未设置支付密码，是否前往设置',
          success: (res) => {
            if (res.confirm) {
              this.payCodeShow = false;
              this.$nextTick(() => {
                this.$router.push(
                  '/pages/personage/information/payment-code?status=0'
                );
              });
            } else if (res.cancel) {
           		this.showPasswordboard = true;
            }
          }
        });
      } else {
        uni.showToast({
          title: message,
          icon: 'none',
          duration: 2000
        });
      }
    }
  },
  filters: {
    payText(value) {
      const textList = {
        1: '付款',
        2: '收款',
        3: '向您收款'
      };
      return textList[value];
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== 'informationPaymentCode') {
      this.$destroy();
      this.$store.commit('deleteKeepAlive', from.name);
    }
    next();
  }
};
</script>

<style lang="scss" scoped>
.tf-main-container {
  padding: 30rpx 20rpx 0;
}
.payment-box {
  background: #fff;
  border-radius: 10rpx;
  padding: 30rpx 30rpx 20rpx;
  margin-top: 30rpx;
  &__text {
    font-size: 28rpx;
    margin-bottom: 20rpx;
  }
  &__money {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 2rpx solid #F0F0F0;
    text {
      font-size: 52rpx;
    }
    .tf-icon-xingfubi1 {
      color: $red-dark;
    }
    &-number {
      height: 72rpx;
      padding-left: 20rpx;
      font-size: 72rpx;
    }
    .tf-icon-close-circle-fill {
      padding: 10rpx 0 10rpx 10rpx;
      font-size: 44rpx;
      color: #aaaaaa;
    }
  }
}
.paycode-dialog {
  ::v-deep .tf-dialog__wrapper-box {
    width: 700rpx;
  }
  ::v-deep .van-password-input{
    margin: 0;
  }
}
</style>
