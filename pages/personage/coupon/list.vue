<template>
  <view class="coupon-list-page">
    <uni-nav-bar
      title="优惠券"
      left-icon="left"
      statusBar="true"
      :fixed="true"
      :border="false"
      @click-left="$router.go(-1)"
    >
      <template #right>
        <image class="nav-icon" @click="goCouponPurchaseRecords" />
      </template>
    </uni-nav-bar>
    <van-tabs :active="current" @change="onTabChange">
      <van-tab title="未使用" name="1"></van-tab>
      <van-tab title="已使用" name="2"></van-tab>
      <van-tab title="已过期" name="3"></van-tab>
    </van-tabs>
    <view class="coupon-list">
      <template v-if="listData && listData.length">
        <view v-for="item in listData" :key="item.id" class="tf-mb-20">
          <coupon-item :data="item" :status="current">
            <template v-if="current == 1">
              <button
                v-if="item.coupon_type == 0"
                class="btn-click"
                @click.native.stop="goLife"
              >
                去使用
              </button>
              <view
                v-else
                class="tf-icon tf-icon-erweima"
                @click="openQRCode(item.ewm_data)"
              ></view>
            </template>
            <template v-else-if="current == 2">
              <image
                class="invalid-icon"
                mode="aspectFit"
                src="@/static/personage/used.png"
              ></image>
            </template>
            <template v-else>
              <image
                class="invalid-icon"
                src="@/static/personage/out_date.png"
              ></image>
            </template>
          </coupon-item>
        </view>
      </template>
      <template v-else-if="loadMoreStatus === 'no-more'">
        <view class="no-data-box">
          <image class="no-data-img" src="@/static/main/empty_coupon.png" />
          <!-- <view class="no-data-text">暂无内容</view> -->
        </view>
      </template>
      <uni-load-more :status="loadMoreStatus" />
      <button class="fixed-btn tf-btn-primary" @click="goCouponPurchaseRecords">
        购买记录
      </button>
    </view>
    <tf-popup v-model="visible" class="coupon-qr-popup">
      <uni-icons
        class="tf-icon-guanbi-circle"
        type="close"
        size="25"
        color="#fff"
        @click="visible = false"
      ></uni-icons>
      <view class="coupon-qr-popup-header">
        <view class="coupon-qr-popup-title">优惠券</view>
        <view class="coupon-qr-popup-name">{{ QRData.coupon_name }}</view>
        <view class="coupon-qr-popup-time">{{ QRData.g_time2 }}</view>
      </view>
      <view class="coupon-qr-popup-content">
        <view class="coupon-qr-popup-shop-name">{{ QRData.shops_name }}</view>
        <view class="coupon-qr-popup-text">（请出示给工作人员进行核销）</view>
        <image class="coupon-qr-popup-img" :src="QRData.url" alt="" />
      </view>
    </tf-popup>
  </view>
</template>

<script>
import ListMixins from '@/mixins/list';
import { mapGetters } from 'vuex';
import TfPopup from '@/components/TfPopup';
import CouponItem from './components/CouponItem';
import { getCoupon } from '@/api/personage';

export default {
  name: 'couponList',
  mixins: [ListMixins],
  components: {
    CouponItem,
    TfPopup
  },
  data() {
    return {
      current: '1',
      QRData: {},
      visible: false
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    getListData() {
      return getCoupon({
        pages: this.pageNum,
        c_type: this.current
      })
    },
    onTabChange(event) {
      this.current = event.detail.name;
      this.refreshLoad();
    },
    openQRCode(data) {
      this.QRData = data;
      this.visible = true;
    },
    goLife() {
      this.$router.push({
        name: 'life'
      });
    },
    goCouponPurchaseRecords() {
      this.$router.push({
        path: '/pages/personage/coupon/purchaseRecord'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.coupon-list-page ::v-deep .van-tabs {
  z-index: 2;
}
.coupon-list-page ::v-deep .van-tabs__wrap {
  width: 100%;
  position: fixed;
  z-index: 2;
  .van-tab--active .tf-ellipsis {
    font-size: 32rpx;
    font-weight: 600;
    color: #000000;
  }
  .van-tabs__line {
    width: 40rpx !important;
    height: 6rpx;
    left: -2rpx;
    background: #ff6555;
    border-radius: 3rpx;
  }
}
.coupon-list {
  padding: 30rpx 20rpx;
  margin-top: var(--tabs-line-height, 44px);
}
.no-data-box {
  .no-data-img {
    width: 100%;
    height: 500rpx;
  }
  .no-data-text {
    margin-top: 40rpx;
    font-size: 26rpx;
    color: #8f8f94;
    text-align: center;
  }
}
.btn-ing {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120rpx;
  height: 56rpx;
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
.invalid-icon {
  width: 107rpx;
  height: 94rpx;
}
.tf-icon-erweima {
  font-size: 40rpx;
  line-height: 1;
}
.fixed-btn {
  width: 200rpx;
  position: fixed;
  left: 275rpx;
  bottom: 60rpx;
  z-index: 2;
  border-radius: 36rpx;
}
.coupon-qr-popup {
  width: 560rpx;
  // height: 811rpx;
  background: #ffffff;
  border-radius: 10rpx;
  overflow: initial;
  ::v-deep .uni-popup__wrapper {
    border-radius: 10rpx 10rpx 0 0;
  }
  .tf-icon-guanbi-circle {
    position: absolute;
    right: 0;
    top: -100rpx;
    font-size: 50rpx;
    color: #fff;
  }
  &-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 202rpx;
    padding-top: 30rpx;
    background: #ff6555;
    border-radius: 10rpx 10rpx 0 0;
  }
  &-title {
    margin-bottom: 30rpx;
    font-size: 28rpx;
    color: #ffffff;
    line-height: 1;
  }
  &-name {
    margin-bottom: 30rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #ffffff;
    line-height: 1;
  }
  &-time {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 56rpx;
    background: #ffffff33;
    font-size: 24rpx;
    color: #ffffff;
    line-height: 1;
  }
  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40rpx;
    padding-bottom: 50rpx;
  }
  &-shop-name {
    padding: 0 90rpx;
    margin-bottom: 30rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #222222;
    text-align: center;
  }
  &-text {
    margin-bottom: 20rpx;
    font-size: 24rpx;
    color: #8f8f94;
  }
  &-img {
    width: 382rpx;
    height: 382rpx;
  }
}
</style>
