<template>
  <view>
    <uni-nav-bar
      title="奖品核销"
      statusBar="true"
      left-icon="left"
      :fixed="true"
      :border="false"
      @click-left="$router.go(-1)"
    />
    <view class="tf-p-30-20">
      <view class="tf-p-30 tf-rounded-10 tf-bg-white">
        <view class="card-title">买家信息</view>
        <view class="tf-row-justify-between tf-mb-20">
          <text class="card-text-gray-4">用户昵称</text>
          <text class="card-text-gray-4">{{ infoData.nickname }}</text>
        </view>
        <view class="tf-row-justify-between">
          <text class="card-text-gray-4">联系手机</text>
          <view class="tf-row-items-center" @click="callPhone(infoData.mobile)">
            <text class="card-text-gray-4">{{infoData.mobile}}</text>
            <image class="phone-icon" src="@/static/main/phone.png"></image>
          </view>
        </view>
      </view>
      <view class="tf-p-30 tf-mt-20 tf-rounded-10 tf-bg-white">
        <view class="card-title">
          奖品信息
          <text class="tf-text-sm card-text-gray-4" style="float: right;">
            共
            <text class="tf-text-primary">1</text>
            件
          </text>
        </view>
        <view class="tf-row-justify-between">
          <view class="tf-flex-row">
            <view class="card-tag">1</view>
            <view class="tf-ml-20">
              <view class="card-text-gray-4">{{ infoData.award_name }}</view>
              <view class="tf-text-sm card-text-gray-9 tf-mt-10">
                活动方：{{ infoData.project_name }}
              </view>
            </view>
          </view>
          <view class="card-text-gray-9 tf-text-sm">X1</view>
        </view>
      </view>
      <view
        v-if="infoData.type == 2"
        class="tf-p-30 tf-mt-20 tf-rounded-10 tf-bg-white"
      >
        <view class="card-title">核销信息</view>
        <view class="tf-row-justify-between tf-mb-20">
          <text class="card-text-gray-4">核销人</text>
          <view class="tf-row-items-center" @click="callPhone(infoData.admin_mobile)">
            <text class="card-text-gray-4">{{ infoData.admin_name }} {{ infoData.admin_mobile }}</text>
            <image class="phone-icon" src="@/static/main/phone.png"></image>
          </view>
        </view>
        <view class="tf-row-justify-between">
          <text class="card-text-gray-4">核销方式</text>
          <text class="card-text-gray-4">{{ infoData.admin_text }}</text>
        </view>
      </view>
    </view>
    <view class="fixed-placeholder">
      <button class="fixed-btn" :class="btnClassName" @click="awardOperation">
        {{ infoData.type | typeText }}
      </button>
    </view>
  </view>
</template>

<script>
import { getAwardScan, awardOperation } from '@/api/award.js';
export default {
  data() {
    return {
      id: '',
      infoData: {}
    };
  },
  computed: {
    btnClassName() {
      const classNames = {
        1: 'tf-btn-primary',
        2: 'tf-btn-gray',
        3: 'tf-btn-red'
      };
      const value = this.infoData.type;
      return classNames[value];
    }
  },
  onLoad({ id }) {
    this.id = id;
    this.getAwardScan();
  },
  filters: {
    typeText(value) {
      const text = {
        1: '确定核销',
        2: '已核销',
        3: '奖品不属于我方'
      };
      return text[value] || '';
    }
  },
  methods: {
    async getAwardScan() {
      const { data } = await getAwardScan({
        award_log_id: this.id
      });
      this.infoData = data;
    },
    async awardOperation() {
      if (!+this.infoData.is_convert && +this.infoData.is_power) {
        const { success } = await awardOperation({
          award_log_id: this.id
        });
        if (success) {
          uni.showToast({
            title: '核销成功'
          });
          this.getAwardScan();
        }
      }
    },
    callPhone(phoneNumber) {
      uni.makePhoneCall({
        phoneNumber
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.card-title {
  margin-bottom: 30rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #000000;
}
.card-text-gray-4 {
  color: #4d4d59;
}
.card-text-gray-9 {
  color: #999;
}
.phone-icon {
  width: 22rpx;
  height: 28rpx;
  margin-left: 20rpx;
}
.card-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40rpx;
  height: 40rpx;
  background: #febf00;
  border-radius: 6rpx 6rpx 6rpx 6rpx;
  font-size: 24rpx;
  color: #ffffff;
}
.fixed-placeholder {
  height: calc(118rpx + env(safe-area-inset-bottom));
  height: calc(118rpx + constant(safe-area-inset-bottom));
}
.fixed-btn {
  width: 710rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  position: fixed;
  left: 20rpx;
  bottom: calc(30rpx + env(safe-area-inset-bottom));
  bottom: calc(30rpx + constant(safe-area-inset-bottom));
  z-index: 2;
}
.tf-btn-gray {
  background-color: #eeeeee;
  color: #999999;
}
.tf-btn-red {
  background-color: #ff65551a;
  color: #ff6555;
}
</style>
