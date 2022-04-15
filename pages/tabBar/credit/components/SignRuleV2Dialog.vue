<template>
  <uni-popup ref="dialog">
    <view class="sign-popup">
      <view class="sign-header">
        签到规则<i class="tf-icon tf-icon-guanbi" @click="visible = false"></i>
      </view>
      <view class="sign-rule-dialog">
        <view class="sign-rule-title">“家庭签到”规则：</view>
        <view class="sign-rule-text">
          1、同个房间号下绑定业主、业主成员、租户、租户成员等，当前每日签到均可得5幸福币；
        </view>
        <view class="sign-rule-text"> 2、每个房间号的“家庭签到”当前每日额度最高为15幸福币； </view>
        <view class="sign-rule-text">
          3、成员签到规则如下：按签到先后顺序，A房间下业主张先生签到得5幸福币，业主成员老张，小张签到各得5幸福币，租户小王再签到提示“明天早点来哦”；
        </view>
        <view class="sign-rule-text"> 4、若签到规则调整以新规则说明为准。 </view>
      </view>
      <button class="sign-btn" @click="visible = false">确定</button>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: 'SignRuleV2Dialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: this.value,
    }
  },
  methods: {
    operate(val) {
      if (val) {
        this.open()
      } else {
        this.close()
      }
    },
    open() {
      this.$refs['dialog'].open(this.type)
    },
    close() {
      this.$refs['dialog'].close()
      this.$emit('closed')
    },
  },
  watch: {
    value(val) {
      if (this.visible !== val) {
        this.visible = val
      }
    },
    visible(val) {
      this.$emit('input', val)
      this.operate(val)
    },
  },
}
</script>

<style lang="scss" scoped>
.sign-popup {
  width: 560rpx;
  border-radius: 10rpx;
  background-color: #fff;
  .sign-btn {
    width: 560rpx;
    height: 80rpx;
    background: #febf00;
    border-radius: 10rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #ffffff;
    border: none;
    ::v-deep .van-button__text {
      line-height: 1;
    }
  }
  .sign-header {
    position: relative;
    padding: 30rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #222222;
    &::before {
      content: '';
      display: block;
      width: 60rpx;
      height: 12rpx;
      position: absolute;
      bottom: 34rpx;
      left: 30rpx;
      z-index: -1;
      background: #febf00;
      border-radius: 6rpx;
    }
    .tf-icon-guanbi {
      position: absolute;
      top: 30rpx;
      right: 30rpx;
      font-size: 30rpx;
    }
  }
  .sign-rule-dialog {
    padding: 20rpx 30rpx 40rpx;
    .sign-rule-title {
      font-size: 26rpx;
      color: #222222;
      line-height: 48rpx;
    }
    .sign-rule-text {
      font-size: 26rpx;
      color: #8f8f94;
      line-height: 52rpx;
    }
  }
}
</style>
