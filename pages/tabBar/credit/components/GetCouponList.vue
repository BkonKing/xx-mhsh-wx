<template>
  <view class="get-coupon-list">
    <view v-for="(shop, index) in data" :key="index">
      <view
        v-if="shop.shops_name"
        class="shop-name"
        @click="goShopIntroduce(shop.shops_id)"
      >
        <image class="shop-img" src="@/static/personage/shop.png" alt="" />
        {{ shop.shops_name }}
      </view>
      <coupon-item v-for="(coupon, i) in shop.list" :data="coupon" :key="i">
        <button v-if="!coupon.is_complete" class="btn-ing">已领取</button>
        <button
          v-if="coupon.is_complete"
          class="btn-click"
          @click.stop="receive(coupon, index, i)"
        >
          <text
            v-if="coupon.pay_type === '1'"
            class="tf-icon tf-icon-xingfubi1"
          ></text>
          {{ coupon | btnText }}
        </button>
      </coupon-item>
    </view>
  </view>
</template>

<script>
import TfPopup from '@/components/TfPopup/index';
import CouponItem from './CouponItem';
import { payOrderUp } from '@/api/personage';
import { requestPayment, throttle } from '@/utils/util';
import { getCouponReceiveList, receiveCoupon } from '@/api/personage/shop';

export default {
  components: {
    TfPopup,
    CouponItem
  },
  props:{
    creditPayVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeCoupon: {},
      orderId: '',
      payAmount: 0, // 支付金额
      payOrderInfo: {},
      data: [],
      activeShopIndex: 0,
      activeCouponIndex: 0,
      receive: throttle(this.handleReceive)
    };
  },
  filters: {
    btnText(coupon) {
      if (+coupon.coupon_mode === 1) {
        return '免费领';
      } else if (+coupon.pay_type === 2) {
        return `￥${coupon.pay_money}抢券`;
      } else if (+coupon.pay_type === 1) {
        return `${coupon.pay_money}抢券`;
      }
    }
  },
  // created() {
  //   this.init();
  // },
  methods: {
    init() {
      this.getCouponReceiveList();
    },
    async getCouponReceiveList() {
      const { data } = await getCouponReceiveList();
      this.data = data;
      if (!this.data || !this.data.length) {
        this.$emit('noData');
      }
    },
    handleReceive(coupon, shopIndex, couponIndex) {
      this.activeCoupon = coupon;
      this.activeShopIndex = shopIndex;
      this.activeCouponIndex = couponIndex;
      if (+coupon.pay_type === 1) {
        // this.showPayCredit = true;
        this.$emit('update:creditPayVisible', true)
        this.$emit('handleCreditPay', coupon)
        return;
      }
      this.receiveCoupon();
    },
    receiveCoupon() {
      receiveCoupon({
        shops_coupon_id: this.activeCoupon.shops_coupon_id
      })
        .then(({ order_id: orderId }) => {
          // 付费支付
          if (+this.activeCoupon.pay_type === 2) {
            this.orderId = orderId;
            this.payAmount = this.activeCoupon.pay_money;
            this.createPayOrder();
            return;
          }
          this.receiveSuccess();
        })
        .catch(({ code }) => {
          if (+code === 203) {
            this.deleteCoupon();
          }
        });
    },
    receiveSuccess() {
      const {
        coupon_type: couponType,
        miane,
        pay_type: payType,
        give
      } = this.activeCoupon;
      if (+payType === 1) {
        // this.showPayCredit = false;
        this.$emit('update:creditPayVisible', false)
      }
      const contentObj = {
        1: `可用${miane}元`,
        2: `可享${miane}折`,
        3: `满送${give}`
      }
      const content = contentObj[couponType]
      uni.showToast({
        title: `恭喜，抢到了！\n 下单可${content}`,
        duration: 2000,
        icon: 'none'
      });
      this.getCouponReceiveList();
      this.$emit('getSuccess');
    },
    deleteCoupon() {
      const shopCoupon = this.data[this.activeShopIndex].list;
      shopCoupon.splice(this.activeCouponIndex, 1);
      if (shopCoupon.length === 0) {
        this.data.splice(this.activeShopIndex, 1);
      }
    },
    async createPayOrder() {
      const openId = this.$store.state.openId
      if (!openId) {
        await this.$store.dispatch('wxLogin')
        this.createPayOrder()
        return
      }
      payOrderUp({
        order_id: this.orderId,
        pay_type: 1,
        pay_price: this.payAmount,
        openid: openId
      }).then(res => {
        if (res.success) {
          if (res.data) {
            this.payOrderInfo = res.data;
            this.wxPayUp();
          }
        }
      });
    },
    async wxPayUp() {
      await requestPayment({
        // orderInfo: this.payOrderInfo.prepayid,
        timeStamp: this.payOrderInfo.timeStamp,
        nonceStr: this.payOrderInfo.nonceStr,
        package: this.payOrderInfo.package,
        paySign: this.payOrderInfo.paySign,
        signType: this.payOrderInfo.signType
        // apiKey: this.payOrderInfo.appid,
        // mchId: this.payOrderInfo.partnerid,
      })
      this.receiveSuccess();
    },
    goShopIntroduce(shopId) {
      this.$router.push({
        path: '/pages/personage/shop/introduce',
        query: {
          shopId
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.get-coupon-list {
  padding: 0 20rpx 30rpx;

  .shop-name {
    display: flex;
    align-items: center;
    padding-top: 10rpx;
    padding-bottom: 30rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #222222;
  }

  .shop-img {
    width: 32rpx;
    height: 30rpx;
    margin-right: 20rpx;
  }
}

.btn-ing {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120rpx;
  height: 56rpx;
  padding: 0 24rpx;
  background: #f7f7f7;
  border-radius: 28rpx;
  border: none;
  font-size: 24rpx;
  color: #8f8f94;
}

.btn-click {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 120rpx;
  height: 56rpx;
  padding: 0 24rpx;
  background: #ff6555;
  border-radius: 28rpx;
  border: none;
  font-size: 24rpx;
  color: #fff;

  .tf-icon-xingfubi1 {
    margin-right: 10rpx;
  }
}

.credit-popup {
  height: 330rpx;

  .credit-title {
    padding: 30rpx;
    font-size: 32rpx;
    color: #000;
    text-align: center;
  }

  ::v-deep .van-icon-cross {
    top: 30rpx;
    right: 30rpx;
    font-size: 34rpx;
  }

  .credit-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .credit-confirm-btn {
    width: 410rpx;
    height: 80rpx;
    margin: 50rpx 170rpx 30rpx;
    background: #ff6555;
    border-radius: 40rpx;
    border: none;
    font-size: 28rpx;
    color: #ffffff;
  }
}
</style>
