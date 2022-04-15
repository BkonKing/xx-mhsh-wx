<template>
  <view class="tf-mb-30">
    <view
      class="coupon-card"
      :class="[{ 'coupon-card--expanded': expanded }]"
      @click="expanded = !expanded"
    >
      <view class="coupon-money">
        <template v-if="data.coupon_type == 1">
          <text class="coupon-money-icon">￥</text>
          <text class="coupon-money-number">{{ data.miane }}</text>
        </template>
        <template v-else>
          <text class="coupon-money-number">{{ data.miane }}</text>
          <text class="coupon-money-icon">折</text>
        </template>
      </view>
      <view class="coupon-info">
        <view class="tf-row-justify-between">
          <view>
            <view v-if="data.coupon_name" class="coupon-name">
              {{ data.coupon_name }}
            </view>
            <view class="coupon-info-2">{{ data.denomination }}</view>
            <view class="coupon-info-3">{{ data.term_of_validity }}</view>
          </view>
          <view class="left-slot"><slot></slot></view>
        </view>
        <view class="coupon-footer">
          <view class="coupon-footer-text">{{ data.goods_type_name }}</view>
          <uni-icons :type="expanded ? 'top' : 'bottom'"></uni-icons>
        </view>
      </view>
    </view>
    <view class="coupon-panel" :class="{ 'coupon-panel--expanded': expanded }">
      <view class="coupon-content" @click.stop="expanded = true">
        <template>
          <view @click="goShopIntroduce">
            <text>
              优惠说明：{{ data.coupon_explain }} | {{ data.new_goods_type_name1 }}
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
          <view>有效期：{{ data.term_of_validity }}</view>
          <view>使用须知：</view>
          <rich-text
            :nodes="explainContent.replace(/\r\n|\n/g, '<br/>')"
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
    }
  },
  data() {
    return {
      dateShow: false,
      expanded: false
    };
  },
  computed: {
    shopsAddress() {
      return `${this.data.shops_address_area}${this.data.shops_address}`;
    },
    explainContent() {
      return `${this.data.supplementary_content}${
        this.data.coupon_instructions
      }`;
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
          longitude: this.data.shops_longitude,
          latitude: this.data.shops_latitude
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/pages/tabBar/credit/components/CouponItem.scss';
</style>
