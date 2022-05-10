<template>
  <view v-if="infoData.user_coupon_numb" class="shade">
    <view class="coupon-confirm-box">
      <view class="dialog-header">
        <view class="dialog-title">优惠券信息</view>
        <text class="tf-icon tf-icon-guanbi1" @click="$router.go(-1)"></text>
      </view>
      <view class="coupon-container">
        <view class="coupon-info-box">
          <view class="coupon-content">
            <view class="coupon-number">
              <text v-if="infoData.coupon_type == 1">￥</text>
              <text v-if="infoData.coupon_type == 3">{{ infoData.denomination }}</text>
              <template v-else>{{ infoData.denomination }}</template>
              <text v-if="infoData.coupon_type == 2">折</text>
            </view>
            <view>
              <view class="coupon-text">{{ infoData.coupon_name }}</view>
              <view class="coupon-text">{{ infoData.coupon_explain }}</view>
            </view>
          </view>
          <view class="coupon-info-footer">{{ infoData.g_time2 }}</view>
        </view>
        <view class="coupon-rows">
          <view class="coupon-row">
            <view class="coupon-label">所属店铺：</view>
            <view class="coupon-value">{{ infoData.shops_name }}</view>
          </view>
          <view class="coupon-row">
            <view class="coupon-label">券编号：</view>
            <view class="coupon-value">{{ infoData.user_coupon_numb }}</view>
          </view>
          <view class="coupon-row">
            <view class="coupon-label">领取时间：</view>
            <view class="coupon-value">{{ infoData.ptime }}</view>
          </view>
          <view class="coupon-row">
            <view class="coupon-label">领取人：</view>
            <view class="coupon-value">{{ infoData.user_mobile }}</view>
          </view>
        </view>
      </view>
      <button
        class="dialog-btn"
        :class="{ 'dialog-btn-grey': !isCanUse }"
        @click="confirm"
      >
        {{ btnText }}
      </button>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import { getScanCouponInfo, verificationCoupon } from '@/api/personage/shop';
import { throttle } from '@/utils/util.js';

export default {
  data() {
    return {
      infoData: {},
      codeInfo: '',
      confirm: throttle(this.handleConfirm)
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    isCanUse() {
      return +this.infoData.is_ok;
    },
    btnText() {
      return this.isCanUse ? '核销优惠券' : this.infoData.error_text;
    }
  },
  onLoad(options) {
    this.codeInfo = options.codeInfo;
  },
  onShow() {
    this.getScanCouponInfo();
  },
  methods: {
    getScanCouponInfo() {
      getScanCouponInfo({
        code_info: this.codeInfo
      })
        .then(({ data }) => {
          this.infoData = data;
        })
        .catch(() => {
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        });
    },
    handleConfirm() {
      if (this.isCanUse) {
        this.verificationCoupon();
      }
    },
    async verificationCoupon() {
      const { success } = await verificationCoupon({
        shops_user_coupon_id: this.infoData.shops_user_coupon_id
      });
      if (success) {
        uni.showToast({
          title: '核销成功',
          icon: 'none'
        });
        setTimeout(() => {
          this.$router.go(-1);
        }, 500);
      } else {
        uni.showToast({
          title: '核销失败',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.shade {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #1b1b1b99;
}

.coupon-confirm-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 560rpx;
  padding: 30rpx;
  border-radius: 10rpx;
  background: #fff;
}

.dialog-header {
  width: 100%;
  position: relative;
  .dialog-title {
    font-size: 28rpx;
    color: #000000;
    text-align: center;
  }
  .tf-icon-guanbi1 {
    position: absolute;
    top: -110rpx;
    right: -30rpx;
    font-size: 50rpx;
    color: #fff;
  }
}

.coupon-container {
  width: 100%;
  position: relative;
  margin-top: 40rpx;
  .coupon-info-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 200rpx;
    background: linear-gradient(90deg, #ff6555 0%, #ff8d81 100%);
    border-radius: 10rpx;
    .coupon-content {
      display: flex;
      align-items: center;
      flex: 1;
      .coupon-number {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        width: 170rpx;
        padding: 0 20rpx;
        font-size: 40rpx;
        color: #ffffff;
        text {
          margin-bottom: 6rpx;
          font-size: 24rpx;
        }
      }
      .coupon-text {
        font-size: 24rpx;
        font-weight: bold;
        color: #ffffff;
        + .coupon-text {
          margin-top: 20rpx;
        }
      }
    }
    .coupon-info-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 56rpx;
      background: #ffffff33;
      border-radius: 0rpx 0rpx 10rpx 10rpx;
      font-size: 24rpx;
      color: #ffffff;
    }
  }
}

.coupon-rows {
  padding: 10rpx 0 20rpx;
}
.coupon-row {
  display: flex;
  margin-top: 26rpx;
  .coupon-label {
    width: 150rpx;
    font-size: 26rpx;
    color: #8f8f94;
    line-height: 34rpx;
  }
  .coupon-value {
    flex: 1;
    font-size: 26rpx;
    color: #222222;
    line-height: 34rpx;
  }
}

.dialog-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  margin-top: 30rpx;
  background: #ff6555;
  border-radius: 10rpx;
  border: none;
  font-size: 26rpx;
  color: #fff;
}

.dialog-btn-grey {
  background: #f7f7f7;
  color: #bbbbbb;
}
</style>
