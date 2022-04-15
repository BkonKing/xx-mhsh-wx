<template>
  <tfDialog
    v-model="visible"
    title="签到规则"
    :showCancel="false"
    @confirm="visible = false"
  >
    <view class="sign-rule-dialog">
      <view class="tf-text-lg">“家庭签到”规则：</view>
      <view class="tf-text tf-text-gray-7">
        1、同个房间号下绑定业主、业主成员、租户、租户成员等，当前每日签到均可得5幸福币；
      </view>
      <view class="tf-text tf-text-gray-7">
        2、每个房间号的“家庭签到”当前每日额度最高为15幸福币；
      </view>
      <view class="tf-text tf-text-gray-7">
        3、成员签到规则如下：按签到先后顺序，A房间下业主张先生签到得5幸福币，业主成员老张，小张签到各得5幸福币，租户小王再签到提示“明天早点来哦”；
      </view>
      <view class="tf-text tf-text-gray-7">
        4、若签到规则调整以新规则说明为准。
      </view>
    </view>
  </tfDialog>
</template>

<script>
import TfDialog from '@/components/TfDialog/index'
export default {
  name: 'SignRuleDialog',
  components: {
    TfDialog
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: this.value
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss">
.sign-rule-dialog {
  .tf-text-lg {
    margin-bottom: 20rpx;
  }
  .tf-text-gray-7 {
    margin-bottom: 10rpx;
  }
}
</style>
