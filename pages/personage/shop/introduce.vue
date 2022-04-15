<template>
  <view scroll-y="true">
    <uni-nav-bar
      title="店铺资料"
      statusBar="true"
      left-icon="left"
      :fixed="true"
      :border="false"
      @click-left="$router.go(-1)"
    />
    <view class="tf-p-30-20">
      <view class="form-card">
        <view class="form-card-label">店铺名称</view>
        <view class="area-block">
          <text class="text-strong">{{ formData.shops_name }}</text>
        </view>
      </view>
      <view class="tf-mt-20 tf-mb-20">
        <uni-list class="tf-uni-list">
          <uni-list-item title="店铺地址" clickable @click="goLocation">
            <template #footer>
              <view v-if="formData.address" class="tf-flex-row">
                <view class="address-info">
                  <view class="address-name">{{ formData.address }}</view>
                  <view class="address-area">
                    {{
                      formData.address_province +
                        ' ' +
                        formData.address_city +
                        ' ' +
                        formData.address_area +
                        ' '
                    }}
                  </view>
                </view>
                <text class="tf-icon tf-icon-dizhi"></text>
              </view>
              <template v-else>
                --
              </template>
            </template>
          </uni-list-item>
          <uni-list-item
            title="营业时间"
            :rightText="formData.business_hours || '--'"
          ></uni-list-item>
          <uni-list-item
            title="店铺电话"
            clickable
            :rightText="formData.phone || '--'"
            @click="makePhoneCall"
          >
            <template #footer>
              <text class="item-cont">{{ formData.phone || '--' }}</text>
              <view
                v-if="formData.phone"
                class="tf-icon tf-icon-dianhua"
              ></view>
            </template>
          </uni-list-item>
          <uni-list-item
            title="店铺归属"
            :rightText="formData.project_name || '--'"
          ></uni-list-item>
        </uni-list>
      </view>
      <view v-if="formData.shops_notice" class="form-card">
        <view class="form-card-label">店铺公告</view>
        <view class="area-block">{{ formData.shops_notice }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { getShopInformation } from '@/api/personage/shop';

export default {
  name: 'shopIntroduce',
  data() {
    return {
      shopId: '',
      formData: {}
    };
  },
  onLoad(options) {
    this.shopId = options.shopId;
    this.getData();
  },
  methods: {
    async getData() {
      const { shops_info: data } = await getShopInformation({
        shops_id: this.shopId
      });
      this.formData = data;
    },
    makePhoneCall() {
      const phoneNumber = this.formData.phone;
      if (!phoneNumber) return;
      uni.makePhoneCall({
        phoneNumber: this.formData.phone
      });
    },
    goLocation() {
      if (this.formData.address) {
        this.$router.push({
          path: '/pages/personage/shop/location',
          query: {
            name: this.formData.address,
            address: `${this.formData.address_province}${
              this.formData.address_city
            }${this.formData.address_area}${this.formData.address}`,
            longitude: this.formData.longitude,
            latitude: this.formData.latitude
          }
        });
      }
    }
  }
};
</script>

<!-- <style src="./style/form.less" lang="less" scoped></style> -->

<style lang="scss" scoped>
.form-card {
  width: 710rpx;
  padding: 30rpx;
  background: #ffffff;
  border-radius: 10rpx;
  &-label {
    margin-top: 10rpx;
    font-size: 28rpx;
    color: #7a7a7e;
  }
  &-label-required {
    color: #ff5240;
  }
}
.item-left {
  color: #7a7a7e;
}
.item-cont {
  color: #222;
}
.area-block {
  min-height: 42rpx;
  padding-top: 26rpx;
  font-size: 28rpx;
  .text-strong {
    font-weight: bold;
  }
}
.address-info {
  padding-right: 20rpx;
  text-align: right;
}
.address-name {
  font-size: 28rpx;
}
.address-area {
  font-size: 24rpx;
  color: #8f8f94;
}
.tf-icon-dianhua {
  display: inline-block;
  margin-left: 20rpx;
  font-weight: bold;
  color: #222;
  transform: rotateY(180deg);
}
.tf-icon-dizhi {
  padding-top: 4rpx;
}
::v-deep .uni-list-item__extra-text {
  font-size: 28rpx;
  color: #222;
}
</style>
