<template>
  <view>
    <uni-nav-bar
      title="我的反馈"
      statusBar="true"
      left-icon="left"
      :fixed="true"
      :border="false"
      @click-left="$router.go(-1)"
    />
    <view>
      <view v-for="item in listData" :key="item.id">
        <view class="list-item-time">{{ item.ctime }}</view>
        <uni-card :title="item.info_type" :is-shadow="false" @click="goDetail(item)">
          <view class="tf-text-sm">{{ item.content }}</view>
          <template #actions>
            <view v-if="item.reply" class="reply-box">
              <view class="reply-title">回复:</view>
              <view class="reply-content">{{ item.reply }}</view>
            </view>
          </template>
        </uni-card>
      </view>
    </view>
    <uni-load-more :status="loadMoreStatus" />
  </view>
</template>

<script>
import ListMixins from '@/mixins/list';
import { getFeedbackList } from '@/api/personage';

export default {
  mixins: [ListMixins],
  data() {
    return {};
  },
  methods: {
    getListData() {
      return getFeedbackList({
        pages: this.pageNum
      });
    },
    goDetail({ id }) {
      this.$router.push({
        path: '/pages/personage/feedback/detail',
        query: {
          id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.list-item-time {
  margin: 20rpx;
  font-size: 24rpx;
  text-align: center;
  color: $gray-7;
}
.reply-box {
  padding-bottom: 40rpx;
  border-top: 1rpx solid $divider-color;
}

.reply-title {
  margin: 30rpx 0;
  font-size: 24rpx;
  color: #666;
}

.reply-content {
  padding: 20rpx 30rpx;
  font-size: 24rpx;
  line-height: 52rpx;
  color: #666;
  border-radius: 10rpx;
  background-color: #f0f0f0;
}
</style>
