<template>
  <view class="coupon-item">
    <view
      class="coupon-card"
      :class="[
        { 'coupon-card-un': status != 1 },
        { 'coupon-card--expanded': expanded }
      ]"
    >
      <text v-if="data.coupon_type == 1" class="shop-tag">线下店铺</text>
      <view class="coupon-money">
        <template v-if="data.type == 1">
          <text class="coupon-money-icon">￥</text>
          <text class="coupon-money-number">
            {{ isPenny ? Number(data[priceKey]) / 100 : data[priceKey] }}
          </text>
        </template>
        <template v-else>
          <text class="coupon-money-number">{{ data[discountKey] }}</text>
          <text class="coupon-money-icon">折</text>
        </template>
        <view v-if="data.i_img" class="coupon-icon-bg">
          <image :src="data.i_img" />
        </view>
      </view>
      <view class="coupon-info">
        <view class="tf-row-justify-between">
          <view>
            <!-- 真正的商户优惠券名称 -->
            <view v-if="data.yhj_name" class="coupon-name">
              {{ data.yhj_name }}
            </view>
            <view class="coupon-info-2">{{ data[couponNameKey] }}</view>
            <view class="coupon-info-3">
              {{ data.term_of_validity || data.g_time2 }}
            </view>
          </view>
          <view class="left-slot"><slot></slot></view>
        </view>
        <view class="coupon-footer" @click.stop="expanded = !expanded">
          <view class="coupon-footer-text">
            {{
              data.coupon_type != '0' && data.coupon_explain2
                ? data.coupon_explain2
                : data.coupon_explain
            }}
          </view>
          <uni-icons :type="expanded ? 'top' : 'bottom'"></uni-icons>
        </view>
      </view>
    </view>
    <view class="coupon-panel" :class="{ 'coupon-panel--expanded': expanded }">
      <view class="coupon-content" @click.stop="expanded = true">
        <view>券编号：{{ data.coupon_code }}</view>
        <template>
          <view>
            <text v-if="data.new_shops_id">
              优惠说明：{{ data.new_coupon_explain2 }} | {{ data.new_coupon_explain1 }}
            </text>
            <template v-if="data.new_shops_name">
              <text @click="goShopIntroduce">
                | 线下店铺
                <text class="tf-text-strong tf-text-color">
                  【{{ data.new_shops_name }}】
                </text>
              </text>
              <uni-icons class="tf-text-strong" type="right" size="12"></uni-icons>
            </template>
            <text v-else>优惠说明：{{ data.coupon_explain }}</text>
          </view>
          <view v-if="shopsAddress" class="tf-row-items-center">
            <text class="tf-flex-1 tf-ellipsis">
              店铺地址：{{ shopsAddress }}
            </text>
            <text class="tf-icon tf-icon-dizhi" @click="goLocation"></text>
          </view>
          <view v-if="data.new_shops_phone" class="tf-row-items-center">
            <text class="tf-flex-1">店铺电话：{{ data.new_shops_phone }}</text>
            <text
              class="tf-icon tf-icon-dianhua1"
              @click="makePhoneCall"
            ></text>
          </view>
          <view>有效期：{{ data.g_time2 }}</view>
          <view>领取时间：{{ data.ctime }}</view>
          <view>使用须知：</view>
          <rich-text
            :nodes="data.coupon_rule.replace(/\r\n|\n/g, '<br/>')"
          ></rich-text>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CouponItem',
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    status: {
      type: [Number, String],
      default: ''
    },
    priceKey: {
      type: String,
      default: 'reduce_price'
    },
    discountKey: {
      type: String,
      default: 'discount_num'
    },
    couponNameKey: {
      type: String,
      default: 'coupon_name'
    },
    isPenny: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expanded: false
    };
  },
  computed: {
    shopsAddress() {
      return `${this.data.shops_address_area}${this.data.shops_address}`;
    }
  },
  filters: {
    statusText(status) {
      const text = {
        1: '未使用',
        2: '已使用',
        3: '已过期'
      };
      return text[status];
    }
  },
  methods: {
    makePhoneCall() {
      uni.makePhoneCall({
        phoneNumber: this.data.new_shops_phone
      });
    },
    goShopIntroduce() {
      this.$router.push({
        path: '/pages/personage/shop/introduce',
        query: {
          shopId: this.data.new_shops_id
        }
      });
    },
    goLocation() {
      this.$router.push({
        path: '/pages/personage/shop/location',
        query: {
          name: this.data.shops_address,
          address: this.shopsAddress,
          lon: this.data.shops_longitude,
          lat: this.data.shops_latitude
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/pages/tabBar/credit/components/CouponItem.scss';
</style>
