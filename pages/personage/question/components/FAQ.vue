<template>
  <uni-collapse class="tf-collapse" v-model="activeNames">
    <uni-collapse-item class="tf-collapse-item" v-for="(item, i) in data" :key="item.id" :name="i">
      <template #title>
        <view class="tf-collapse-title">
          <view class="question-index-tag">Q{{i + 1}}</view>
          {{item.question}}
        </view>
      </template>
      <view class="question-content">
        <rich-text :nodes="item.answer.replace(/\r\n/g, '<br/>')"></rich-text>
      </view>
    </uni-collapse-item>
  </uni-collapse>
</template>

<script>
export default {
  name: 'FAQ',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      activeNames: []
    }
  }
}
</script>

<style lang="scss" scoped>
.question-index-tag {
  width: 72rpx;
  height: 45rpx;
  margin-right: 20rpx;
  line-height: 45rpx;
  font-size: 24rpx;
  color: #fff;
  background-color: $gray-8;
  text-align: center;
}
.question-content {
  padding: 0 30rpx 30rpx;
  line-height: 54rpx;
  font-size: 26rpx;
  color: #666;
}

.tf-collapse-title {
  display: flex;
  padding: 30rpx;
  align-items: center;
}
</style>
