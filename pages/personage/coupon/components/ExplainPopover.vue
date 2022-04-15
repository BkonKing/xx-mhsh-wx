<template>
  <view v-if="value" class="mask-bg" @click="calcel(0)">
    <view class="mask-block" @click.stop="calcel(1)">
      <view class="mask-close" @click.stop="calcel(0)">
        <image class="tf-w-h-full" src="@/static/main/close.png" />
      </view>
      <view class="mask-tit">
        <view class="mask-tit-text">不支持退换说明</view>
      </view>
      <view class="mask-cont">
        <view class="mask-cont-text">{{ content }}</view>
      </view>
      <view class="mask-btn tf-row-space-between">
        <view class="mask-sure-btn tf-flex-center" @click.stop="calcel(0)">
          知道了
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'explain-popover',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default:
        '贵重物品、贴身衣物、肉类果蔬生鲜商品、定制商品、虚拟商品、报纸期刊等，处于信息安全或者卫生考虑，不支持无理由退货。跨境商品不支持换货。'
    }
  },
  methods: {
    calcel(val) {
      this.$emit('input', !!val);
    }
  }
};
</script>

<style lang="scss" scoped>
.mask-bg {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.6);
}
.mask-block {
  width: 560rpx;
  height: 528rpx;
  padding: 0 50rpx;
  background-color: #fff;
  border-radius: 10rpx;
  position: relative;
}
.mask-btn {
  width: 460rpx;
  height: 66rpx;
  margin: 0 auto;
}
.mask-btn view {
  width: 100%;
  height: 100%;
  font-size: 30rpx;
  border-radius: 4rpx;
}
.mask-close {
  position: absolute;
  right: 20rpx;
  top: -80rpx;
  width: 70rpx;
  height: 70rpx;
  padding: 10rpx;
  z-index: 5;
}
.mask-sure-btn {
  width: 100%;
  background-color: #eb5841;
  color: #fff;
}
.mask-tit {
  display: flex;
  align-items: center;
  justify-content: center;
	height: 120rpx;
	border-bottom: 2rpx solid #f0f0f0;
}
.mask-tit-text {
  font-size: 30rpx;
  color: #000;
}
.mask-cont {
	margin: 58rpx 0;
}
.mask-cont-text {
  font-size: 24rpx;
	line-height: 46rpx;
}
.color-666 {
	color: #666;
}
</style>
