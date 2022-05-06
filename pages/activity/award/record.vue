<template>
  <view>
    <uni-nav-bar
      title="抽奖记录"
      statusBar="true"
      left-icon="left"
      :fixed="true"
      :border="false"
      @click-left="$router.go(-1)"
    />
    <view class="tf-p-30-20">
      <uni-collapse ref="collapse" v-model="value">
        <uni-collapse-item
          v-for="(item, index) in listData"
          :key="index"
          :show-arrow="false"
          :border="false"
          title-border="none"
          :disabled="index % 2 === 0"
        >
          <template #title>
            <view class="tf-row-justify-between">
              <view></view>
              <view></view>
            </view>
          </template>
          dddd
        </uni-collapse-item>
      </uni-collapse>
    </view>
  </view>
</template>

<script>
import ListMixins from '@/mixins/list';
import { getAwardLogList, getAwardLogInfo } from '@/api/award.js';
export default {
  mixins: [ListMixins],
  data() {
    return {};
  },
  methods: {
    getListData() {
      return getAwardLogList({
        pages: this.pageNum
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  ::v-deep .uni-collapse {
    background: none;
    .uni-collapse-item {
      margin-bottom:  20rpx;
    }
  }
</style>
