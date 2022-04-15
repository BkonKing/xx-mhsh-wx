<template>
  <view class="sale-area">
    <view
      class="commodity-box"
      v-for="(item, i) in data"
      :key="i"
      @click="goCoinCommodity(item)"
    >
      <image class="commodity-image" :src="item.thumb" />
      <view class="commodity-content">
        <view class="commodity-name tf-ellipsis">{{ item.goods_name }}</view>
        <view class="commodity-price">
          <view class="commodity-current-price">
            <text>￥</text>{{ item.s_price }}
          </view>
          <view class="commodity-original-price">￥{{ item.y_price }}</view>
        </view>
        <view class="commodity-coin">
          <text class="tf-icon tf-icon-xingfubi1"></text
          >{{ item.credits }}<text class="commodity-coin-text">可兑换</text>
        </view>
      </view>
    </view>
    <!-- <view class="sale-box">
      <view class="purchase-history" @click="goBuyRecord">购买记录</view>
    </view> -->
  </view>
</template>

<script>
export default {
  name: 'CreditArea',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 购买详情
    goBuyRecord () {
      this.$router.push({ name: 'happinessCoinBuyRecord' })
    },
    // 幸福币专区商品详情
    goCoinCommodity (item) {
      this.$router.push(`/store/goods-detail?id=${item.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.sale-area {
  display: flex;
  padding-left: 20rpx;
  justify-content: space-between;
  flex-wrap: wrap;
}
.commodity-box {
  width: 345rpx;
  margin-right: 20rpx;
  margin-bottom: 30rpx;
  background: #ffffff;
  border-radius: 10rpx;
}
.commodity-image {
  width: 345rpx;
  height: 345rpx;
  background: #f4f4f4;
  border-radius: 10rpx;
}
.commodity-content {
  padding: 30rpx 20rpx 26rpx;
}
.commodity-name {
  width: 100%;
  font-size: 28rpx;
  line-height: 1;
}
.commodity-price {
  display: flex;
  align-items: center;
  margin-top: 30rpx;
  .commodity-current-price {
    margin-right: 10rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #222;
    line-height: 1;
    span {
      font-size: 24rpx;
    }
  }
  .commodity-original-price {
    font-size: 26rpx;
    color: #8f8f94;
    line-height: 1;
    text-decoration: line-through;
  }
}
.commodity-coin {
  margin-top: 18rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #FF6555;
  line-height: 1;
  .tf-icon {
    margin-right: 4rpx;
  }
  &-text {
    margin-left: 6rpx;
  }
  span {
    font-size: 24rpx;
  }
}
.sale-box {
  margin-top: 80rpx;
  @relative();
}
.purchase-history {
  position: absolute;
  top: 0;
  right: 30rpx;
  font-size: 24rpx;
  color: $gray-7;
  line-height: 44rpx;
}
</style>
