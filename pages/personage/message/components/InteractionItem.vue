<template>
  <view class="tf-mb-20">
    <view class="tf-list-content tf-mb-20 tf-row-justify-center">
      {{ data.ctime }}
    </view>
    <view class="tf-list" @click="handleClick">
      <template v-if="data.sub_type == 11 || data.sub_type == 12">
        <view class="tf-row-justify-between">
          <view class="tf-row-items-center">
            <image
              class="tf-avatar-sm tf-mr-20"
              :src="data.avatar"
              mode="aspectFit"
            />
            <view class="tf-text-sm">{{ data.nickname }}</view>
            <view
              v-if="data.is_read == '0'"
              class="tf-circle-tag--warning"
            ></view>
          </view>
          <view class="tf-row-items-center">
            <view class="tf-icon tf-icon-comment reply-icon"></view>
            <view class="tf-text-sm tf-text-gray-7">回复</view>
          </view>
        </view>
        <view class="content-box van-multi-ellipsis--l2">
          {{ data.pl_content }}
        </view>
        <view class="tf-flex-row message-box">
          <view class="tf-text-sm tf-text-blue">{{ data.my_nickname }}</view>
          <view class="tf-text-sm tf-text-gray-7 tf-ellipsis">
            ：{{ data.wd_content }}
          </view>
        </view>
      </template>
      <template v-else-if="data.sub_type == 10">
        <view class="tf-row-items-center tf-mb-30">
          <view class="tf-icon tf-icon-dianzan like-icon"></view>
          <view class="tf-text-sm">{{ data.title }}</view>
          <view
            v-if="data.is_read == '0'"
            class="tf-circle-tag--warning"
          ></view>
        </view>
        <view class="tf-row-items-center message-box">
          <view class="tf-icon tf-icon-dianzan tf-text-orange"></view>
          <view class="tf-text-sm tf-text-gray-7 like-number">
            {{ data.thumbsups }}
          </view>
          <view class="tf-text-sm tf-text-gray-7">{{ data.content }}</view>
        </view>
      </template>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  },
  methods: {
    handleClick() {
      // this.$emit('click', this.data);
    }
  }
};
</script>

<style lang="scss" scoped>
.tf-list {
  display: flex;
  flex-direction: column;
  padding: 30rpx;
  border-radius: 10rpx;
  background-color: #fff;
  margin-bottom: 0;
}
.tf-list-title,
.tf-list-content {
  width: 100%;
  line-height: 1;
  @include text-ellipsis;
}
.tf-list-content {
  font-size: 24rpx;
  line-height: 48rpx;
  color: #8f8f94;
}
.tf-circle-tag--warning {
  width: 14rpx;
  height: 14rpx;
  margin-left: 8rpx;
  border-radius: 10rpx;
  background-color: #eb5841;
}
.message-box {
  align-items: center;
  padding: 20rpx;
  border-radius: 4rpx;
  background-color: #f0f0f0;
}
.tf-text-orange {
  margin-right: 10rpx;
}
.like-icon {
  width: 48rpx;
  height: 48rpx;
  line-height: 48rpx;
  margin-right: 20rpx;
  font-size: 28rpx;
  text-align: center;
  border-radius: 50%;
  background-color: $background-color;
  color: #aaaaaa;
}
.like-number {
  padding-right: 10rpx;
  margin-right: 10rpx;
  border-right-width: 1rpx;
  border-right-style: solid;
  border-right-color: #aaaaaa;
}
.content-box {
  margin: 20rpx 0;
  font-size: 26rpx;
}
.reply-icon {
  color: $orange-dark;
  margin-right: 9rpx;
}
.tf-icon-dianzan.tf-text-orange,
.tf-icon-comment {
  font-size: 34rpx;
}
.more-dialog {
  width: 500rpx;
  padding: 0 30rpx;
  border-radius: 10rpx;
  .more-btn {
    height: 120rpx;
    line-height: 120rpx;
    font-size: 30rpx;
    text-align: center;
  }
  .more-btn + .more-btn {
    border-top: 1rpx solid $divider-color;
  }
}
.tf-text-orange {
  color: #ffc017;
}
</style>
