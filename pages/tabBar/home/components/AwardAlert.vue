<template>
  <tf-popup
    v-model="visible"
    type="center"
    backgroundColor="#fff0"
    :isMaskClick="true"
  >
    <view class="award-container">
      <image
        class="award-bg"
        src="@/static/main/award/bg.png"
        mode="aspectFit"
      ></image>
      <image
        class="award-close"
        src="@/static/main/award/close.png"
        mode="aspectFit"
        @click="close"
      ></image>
      <view class="award-content">
        <view
          v-for="(item, index) in data"
          :key="index"
          class="award-item"
          :class="[`award-item-${item.award_type}`]"
        >
          <image
            v-if="item.award_type === '1'"
            :src="item.img"
            class="tf-w-full tf-h-full"
            mode="scaleToFill"
          ></image>
          <view
            v-else-if="['2', '3'].includes(item.award_type)"
            class="tf-flex-col"
          >
            <text class="award-text-1">{{ item.source_text }}</text>
            <text class="tf-text-sm">{{ item.source_text1 }}</text>
          </view>
          <text v-else class="award-text">{{ item.source_text }}</text>
        </view>
      </view>
      <view class="award-footer">
        <button class="footer-btn footer-btn-1" @click="close">
          <image
            class="footer-btn-bg"
            src="@/static/main/award/btn1.png"
            mode="aspectFit"
          ></image>
          <text>放弃抽奖</text>
        </button>
        <button class="footer-btn footer-btn-2" @click="goAwardIndex">
          <image
            class="footer-btn-bg"
            src="@/static/main/award/btn2.png"
            mode="aspectFit"
          ></image>
          <text>开启福气</text>
        </button>
      </view>
    </view>
  </tf-popup>
</template>

<script>
import TfPopup from '@/components/TfPopup';
export default {
  name: 'AwardAlert',
  components: {
    TfPopup
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false
    };
  },
  watch: {
    value(newValue) {
      if (newValue !== this.visible) {
        this.visible = newValue;
      }
    },
    visible(newValue) {
      this.$emit('input', newValue);
    }
  },
  methods: {
    goAwardIndex() {
      this.$router.push({
        path: '/pages/activity/award/index'
      })
    },
    close() {
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.award-container {
  width: 560rpx;
  height: 576rpx;
  padding-top: 248rpx;
  position: relative;
}
.award-bg {
  width: 560rpx;
  height: 576rpx;
  position: absolute;
  top: 0;
  z-index: -1;
}
.award-close {
  width: 60rpx;
  height: 50rpx;
  position: absolute;
  top: 58rpx;
  right: 64rpx;
}
.award-content {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 146rpx;
  padding: 0 20rpx;
  .award-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 146rpx;
    height: 146rpx;
    padding: 20rpx;
    background: #ffffff;
    border-radius: 6rpx;
    .tf-flex-col {
      align-items: center;
    }
    .award-text-1 {
      font-size: 36rpx;
      font-weight: bold;
      color: #ff6555;
    }
    .award-text {
      font-size: 26rpx;
    }
  }
  .award-item-1 {
    background-color: #fff;
  }
  .award-item-2, .award-item-3 {
    background: linear-gradient(0deg, #FFD2C7 0%, #FFFFFF 100%);
  }
  .award-item-4, .award-item-5 {
    background: linear-gradient(0deg, #FFE9C7 0%, #FFFFFF 100%);
  }
}
.award-footer {
  display: flex;
  padding: 0 34rpx;
  margin-top: 60rpx;
  .footer-btn {
    height: 96rpx;
    line-height: 90rpx;
    padding: 0;
    background: none;
  }
  .footer-btn-1 {
    width: 152rpx;
    color: #c26c41;
  }
  .footer-btn-2 {
    width: 322rpx;
    color: #fff;
  }
  .footer-btn-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
}
</style>
