<template>
  <view class="card-box" @click="goCouponDetail(data)">
    <view class="card-header">
      <view>
        <text>订单编号：</text>
        <text>{{ data.order_numb }}</text>
      </view>
      <view class="tf-text-sm">{{ data.order_status_name }}</view>
    </view>
    <view class="card-content">
      <image
        v-if="type === 1"
        class="card-img"
        src="@/static/personage/shop/coupon.png"
        alt=""
      />
      <image
        v-else-if="type === 2"
        class="card-img"
        src="@/static/personage/shop/bank.png"
        alt=""
      />
      <view class="coupon-info">
        <view class="card-name">
          {{ data.order_goods_specs_list[0].goods_name }}
        </view>
        <view v-if="type === 1" class="card-text">1张</view>
        <view v-else-if="type === 2" class="card-text">支付认证</view>
        <view class="card-text tf-row-vertical-center">
          <text class="tf-text-sm">不支持退换</text
          ><text
            class="tf-icon tf-icon-lishijilu"
            @click.stop="popoverVisible = true"
          ></text>
        </view>
      </view>
      <view class="card-content-right">
        <view class="card-money">
          ￥{{
            data.pay_type == 1
              ? data.happiness_price / 100
              : data.pay_price / 100
          }}
        </view>
        <view class="card-text">×1</view>
      </view>
    </view>
    <view class="card-footer">
      <view class="card-text">共 {{ data.goods_num }} 件</view>
      <view class="card-text">
        合计：<text class="card-user-money"
          >￥{{
            data.pay_type == 1
              ? data.happiness_price / 100
              : data.pay_price / 100
          }}</text
        >
      </view>
    </view>
    <explain-popover v-model="popoverVisible"></explain-popover>
  </view>
</template>

<script>
import ExplainPopover from './ExplainPopover'
export default {
  name: 'CouponOrderCard',
  components: {
    ExplainPopover
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      popoverVisible: false
    }
  },
  methods: {
    goCouponDetail ({ id }) {
      this.$router.push({
        path: '/pages/personage/coupon/detail',
        query: {
          id,
          type: this.type
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-box {
  width: 710rpx;
  min-height: 372rpx;
  padding: 0 30rpx;
  margin-bottom: 30rpx;
  background: #ffffff;
  border-radius: 10rpx;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 82rpx;
    border-bottom: 1rpx solid #f0f0f0;
    div,
    text {
      font-size: 24rpx;
      line-height: 1;
      color: #222222;
    }
  }
  .card-content {
    display: flex;
    padding: 30rpx 0 40rpx;
    .card-img {
      width: 130rpx;
      height: 130rpx;
      margin-right: 22rpx;
    }
    .coupon-info {
      flex: 1;
      margin-right: 20rpx;
      .card-name {
        margin-bottom: 20rpx;
        font-size: 28rpx;
        font-weight: bold;
        color: #222222;
        line-height: 1;
        + .card-text {
          margin-bottom: 24rpx;
        }
      }
      .tf-icon-lishijilu {
        padding: 12rpx;
        font-size: 30rpx;
        color: #aaaaaa;
      }
    }
    .card-content-right {
      min-width: 150rpx;
      text-align: right;
      .card-money {
        margin-bottom: 72rpx;
        font-size: 28rpx;
        font-weight: bold;
        color: #222222;
      }
    }
  }
  .card-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 88rpx;
    border-top: 1rpx solid #f0f0f0;
    .card-text + .card-text {
      margin-left: 30rpx;
    }
    .card-user-money {
      font-size: 34rpx;
      font-weight: bold;
      color: #222;
    }
  }
  .card-text {
    font-size: 24rpx;
    color: #8f8f94;
    line-height: 1;
  }
}
</style>
