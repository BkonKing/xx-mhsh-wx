<template>
  <view class="app-body">
    <view class="body-block">
      <view class="order-bar">
        <uni-nav-bar
          title="订单详情"
          statusBar="true"
          left-icon="left"
          :border="false"
          :fixed="true"
          @click-left="$router.go(-1)"
        />
      </view>
      <view class="order-session">
        <view class="order-header-bg"></view>
        <view class="order-status-session">
          <view class="order-status-name">已完成</view>
          <view class="order-status-tip">感谢您的购买</view>
        </view>
        <view class="cont-session" style="padding-bottom: 0;">
          <view class="order-goods-info">
            <view class="order-pic-block">
              <image
                v-if="type === 1"
                class="tf-w-h-full"
                mode="aspectFill"
                src="@/static/personage/shop/coupon.png"
              />
              <image
                v-else-if="type === 2"
                class="tf-w-h-full"
                mode="aspectFill"
                src="@/static/personage/shop/bank.png"
              />
            </view>
            <view class="order-info">
              <view class="order-name-price">
                <view class="order-name p-nowrap">
                  {{ goodsInfo.goods_name }}
                </view>
                <view class="order-price">
                  ￥{{ (goodsInfo.s_price || 0) / 100 }}
                </view>
              </view>
              <view class="order-sku-num">
                {{ isCoupon ? '1张' : '支付认证' }}
              </view>
              <view class="order-action-session">
                <view class="order-action-text">
                  <text class="tf-text-sm">不支持退换</text>
                  <text
                    class="tf-icon tf-icon-lishijilu"
                    @click.stop="popoverVisible = true"
                  ></text>
                </view>
                <view class="order-buy-num">×1</view>
              </view>
            </view>
          </view>
          <view
            v-if="isCoupon"
            class="coupon-info"
            :class="{ 'coupon-info--expanded': expanded }"
          >
            <view class="coupon-content" @click="expanded = true">
              <view>券状态：{{ couponInfo.c_status_name }}</view>
              <view>券编号：{{ couponInfo.user_coupon_numb }}</view>
              <template v-if="expanded">
                <view>
                  优惠说明：{{ couponInfo.coupon_explain }}
                  <text
                    v-if="shopInfo.shops_address"
                    class="tf-icon tf-icon-dizhi"
                    @click="goLocation"
                  ></text>
                </view>
                <view>有效期：{{ couponInfo.g_time }}</view>
                <view>领取时间：{{ couponInfo.ctime }}</view>
                <view>使用须知：</view>
                <rich-text
                  class="tf-text-sm"
                  :nodes="couponRule.replace(/\r\n|\n/g, '<br/>')"
                ></rich-text>
              </template>
            </view>
            <uni-icons
              class="van-icon-arrow"
              :type="expanded ? 'top' : 'bottom'"
              @click="expanded = !expanded"
            ></uni-icons>
          </view>
          <view class="detail-price-list">
            <view class="detail-price-item">
              <view>商品总价</view>
              <view>￥{{ orderInfo.goods_price_total / 100 }}</view>
            </view>
            <view v-if="creaditPrice" class="detail-price-item">
              <view>幸福币抵扣</view>
              <view>-￥{{ creaditPrice / 100 }}</view>
            </view>
          </view>
          <view class="order-total">
            <view class="tf-text-sm">共 1 件</view>
            <view class="order-price-text">合计:</view>
            <view class="order-total-money">
              ￥{{
                (orderInfo.pay_type == 1 ? creaditPrice : orderInfo.pay_price) /
                  100
              }}
            </view>
          </view>
        </view>
        <view class="cont-session order-message">
          <view class="order-message-item">
            订单编号：{{ orderInfo.order_numb }}
            <view class="copy-btn" @click="copy">复制</view>
          </view>
          <view class="order-message-item">
            下单时间： {{ orderInfo.ctime }}
          </view>
          <view class="order-message-item">
            支付方式：{{ orderInfo.payment_type_name }}
          </view>
          <view class="order-message-item">
            支付时间：{{ orderInfo.pay_time }}
          </view>
        </view>
      </view>
    </view>
    <explain-popover v-model="popoverVisible"></explain-popover>
  </view>
</template>

<script>
import ExplainPopover from './components/ExplainPopover';
import { getOrderDetail } from '@/api/personage.js';
export default {
  components: {
    ExplainPopover
  },
  data() {
    return {
      type: 1,
      popoverVisible: false,
      expanded: false,
      goodsInfo: {},
      orderInfo: {}
    };
  },
  computed: {
    shopInfo() {
      return this.orderInfo.shops_user_coupon_info || {};
    },
    couponInfo() {
      return this.shopInfo.shops_user_coupon_data
        ? this.shopInfo.shops_user_coupon_data
        : {};
    },
    couponRule() {
      const value = this.couponInfo.coupon_rule || '';
      return value.replace(/\r\n|\n/g, '<br/>');
    },
    isCoupon() {
      return this.type === 1;
    },
    creaditPrice() {
      return +this.orderInfo.happiness_price;
    }
  },
  onLoad(options) {
    this.order_id = options.id;
    this.type = +options.type;
    this.getData();
  },
  methods: {
    getData() {
      getOrderDetail({
        order_project_id: this.order_id,
        order_type: this.isCoupon ? 3 : 4
      }).then(res => {
        if (res.success) {
          this.goodsInfo = res.order_goods_specs_list[0];
          this.orderInfo = res.order_project_info;
        }
      });
    },
    goLocation() {
      this.$router.push({
        path: '/pages/personage/shop/location',
        query: {
          name: this.shopInfo.shops_address,
          address: `${this.shopInfo.shops_address_province}${
            this.shopInfo.shops_address_city
          }${this.shopInfo.shops_address_area}${this.shopInfo.shops_address}`,
          lon: this.shopInfo.shops_longitude,
          lat: this.shopInfo.shops_latitude
        }
      });
    },
    copy() {
      uni.setClipboardData({
        data: this.orderInfo.order_numb,
        success: function() {
          uni.showToast({
            title: '复制成功',
            icon: 'none'
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-body {
  width: 100%;
  background-color: #f2f2f4;
  font-size: 28rpx;
}
.order-bar {
  ::v-deep .uni-navbar__header,
  ::v-deep .uni-navbar__content{
    background-image: linear-gradient(to right, #f9866b, #eb5841) !important;
  }
  ::v-deep .uni-icons,
  ::v-deep .uni-nav-bar-text{
    color: #fff !important;
  }
}
// 头部
.order-session {
  position: relative;
  padding: 0 20rpx;
}
.order-header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 280rpx;
  background-image: linear-gradient(to right, #f9866b, #eb5841);
}
.order-status-session {
  padding-top: 70rpx;
  padding-bottom: 40rpx;
  position: relative;
  z-index: 6;
  color: #fefefe;
  text-align: center;
  .order-status-name {
    margin-bottom: 30rpx;
    font-size: 38rpx;
    font-weight: bold;
  }
  .order-status-tip {
    font-size: 28rpx;
  }
}

.cont-session {
  width: 710rpx;
  padding: 40rpx 30rpx;
  position: relative;
  background-color: #fff;
  border-radius: 10rpx;
}
// 订单详情
.order-goods-info {
  display: flex;
  justify-content: space-between;
  min-height: 130rpx;
  margin-bottom: 40rpx;
  .order-pic-block {
    width: 130rpx;
    height: 130rpx;
    border-radius: 4rpx;
  }
  .order-info {
    width: 500rpx;
    > view {
      line-height: 1;
    }
    > view + view {
      margin-top: 22rpx;
    }
  }
  .order-sku-num,
  .order-buy-num,
  .order-action-session {
    color: #8f8f94;
    font-size: 24rpx;
  }
  .order-buy-num {
    text-align: right;
  }
  .order-name-price,
  .order-action-session {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .order-action-text {
    display: flex;
    align-items: center;
  }
}

// 券
.coupon-info {
  width: 650rpx;
  min-height: 120rpx;
  padding: 30rpx;
  position: relative;
  background: #f7f7f7;
  border-radius: 10rpx;
  &--expanded {
    height: auto;
  }
  .coupon-content {
    color: #8f8f94;
    view {
      font-size: 24rpx;
      line-height: 42rpx;
    }
    .tf-text-strong {
      font-weight: bold;
      color: #222;
    }
  }
  .van-icon-arrow {
    position: absolute;
    top: 30rpx;
    right: 30rpx;
    &::before {
      transform: rotate(90deg) translateZ(0);
      transition: transform 0.3s;
    }
    &--expanded::before {
      transform: rotate(-90deg);
    }
  }
}

// 订单价格信息
.detail-price-list {
  padding: 14rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  .detail-price-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 54rpx;
    > view {
      font-size: 24rpx;
      color: #222;
    }
  }
}

// 支付合计
.order-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 88rpx;
  color: #8f8f94;
  .order-price-text {
    margin-left: 20rpx;
    font-size: 24rpx;
  }
  .order-total-money {
    font-size: 34rpx;
    font-weight: bold;
    color: #222222;
  }
}

// 订单信息
.order-message {
  margin-top: 30rpx;
  margin-bottom: 30rpx;
  .order-message-item {
    position: relative;
    font-size: 28rpx;
    color: #8f8f94;
  }
  .order-message-item + .order-message-item {
    margin-top: 40rpx;
  }
  .copy-btn {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 58rpx;
    height: 34rpx;
    padding: 0 8rpx;
    border: 1rpx solid #ffa110;
    font-size: 22rpx;
    color: #ffa110;
  }
}
.tf-icon-dizhi {
  margin-left: 10rpx;
  font-weight: bold;
  color: #222;
}
.tf-icon-lishijilu {
  padding: 12rpx;
  font-size: 30rpx;
  color: #aaaaaa;
}
</style>
