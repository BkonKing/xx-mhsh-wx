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
      <uni-collapse
        ref="collapse"
        v-model="collapseValue"
        :accordion="true"
        @change="handleChange"
      >
        <uni-collapse-item
          v-for="(item, index) in listData"
          title-border="none"
          :key="index"
          :show-arrow="false"
          :border="false"
          :disabled="item.is_select == '0' || item.cash_type == '1'"
        >
          <template #title>
            <view
              class="tf-row-justify-between tf-bg-white tf-p-30 tf-rounded-10"
              @click="goOrderDetail(item)"
            >
              <view>
                <view class="tf-text-strong">{{ item.select_name }}</view>
                <view
                  v-if="item.is_select == '1'"
                  class="tf-mt-20 tf-text-sm tf-text-gray-7"
                  :class="{ 'tf-text-primary': item.is_convert == 0 }"
                >
                  {{ item.convert_name }}
                  <!-- collapseValue &&
                      collapseValue.findIndex(obj => obj == index) > -1 -->
                  <uni-icons
                    :type="
                      collapseValue && collapseValue == index
                        ? 'bottom'
                        : 'right'
                    "
                    size="12"
                  ></uni-icons>
                </view>
              </view>
              <view>
                <view class="tf-text-gray-4">{{ item.ctime }}</view>
                <view
                  class="tf-text-sm tf-text-gray-7 tf-text-align-right tf-mt-20"
                >
                  {{
                    item.consume == '0'
                      ? '免费抽奖'
                      : `使用${item.consume}幸福币抽奖`
                  }}
                </view>
              </view>
            </view>
          </template>
          <template v-if="item.cash_type == '2'">
            <template v-if="item.is_convert == '0'">
              <view class="tf-p-0-30">
                <view class="tf-column-items-center xx-card">
                  <view class="tf-mb-20 tf-text-strong">
                    兑换时请出示二维码给工作人员
                  </view>
                  <view class="xx-card-text">活动方：滑县美好生活家园</view>
                  <image
                    class="xx-card-qrcode"
                    :src="item.awardLogCode"
                    mode="aspectFill"
                  ></image>
                </view>
              </view>
            </template>
            <template v-else>
              <view class="tf-p-0-30">
                <view class="xx-card">
                  <view class="xx-card-text">兑换成功：{{ item.etime }}</view>
                  <view class="xx-card-text">核销人：{{ admin_text }}</view>
                  <view class="xx-card-text">
                    活动方：{{ item.project_name }}
                  </view>
                  <image
                    class="xx-card-image"
                    src="@/static/main/award/success.png"
                    mode="widthFix"
                  ></image>
                </view>
              </view>
            </template>
          </template>
        </uni-collapse-item>
      </uni-collapse>
      <view v-if="listData.length === 0" class="tf-column-items-center">
        <image
          class="empty-image"
          src="@/static/main/award/empty.png"
          mode="aspectFill"
        ></image>
        <text class="tf-mt-30 tf-text-gray-9">暂无记录</text>
      </view>
    </view>
  </view>
</template>

<script>
import ListMixins from '@/mixins/list';
import { getAwardLogList, getAwardLogInfo } from '@/api/award.js';
export default {
  mixins: [ListMixins],
  data() {
    return {
      pageSize: 20,
      collapseValue: '',
      timer: null
    };
  },
  onHide() {
    this.clearTimeout();
  },
  methods: {
    getListData() {
      return getAwardLogList({
        page: this.pageNum
      });
    },
    goOrderDetail({ order_project_id }) {},
    handleChange(index) {
      this.timer && clearTimeout(this.timer);
      const { is_convert: isConvert, is_select: isSelect } = this.listData[
        index
      ];
      console.log(this.listData[index]);
      if (+isSelect && !+isConvert) {
        this.getAwardLogInfo(index);
      }
    },
    async getAwardLogInfo(index) {
      const { data } = await getAwardLogInfo({
        award_log_id: this.listData[index].id
      });
      if (+data.is_convert) {
        this.listData[index] = data;
      } else {
        this.timer = setTimeout(() => {
          this.getAwardLogInfo(index);
        }, 3000);
      }
    },
    clearTimeout() {
      this.timer && clearTimeout(this.timer);
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .uni-collapse {
  background: none;
  .uni-collapse-item {
    margin-bottom: 20rpx;
  }
}
.tf-text-gray-4 {
  font-size: 24rpx;
  color: #4d4d59;
}
.tf-p-0-30 {
  padding: 0 30rpx 30rpx;
}
.tf-text-gray-9 {
  color: #999;
}
.empty-image {
  width: 300rpx;
  height: 240rpx;
  margin-top: 370rpx;
}
.xx-card {
  width: 650rpx;
  min-height: 200rpx;
  padding: 30rpx;
  position: relative;
  background: #f7f7f7;
  border-radius: 10rpx 10rpx 10rpx 10rpx;
  .xx-card-text {
    margin-bottom: 20rpx;
    font-size: 24rpx;
    color: #222222;
  }
  .xx-card-image {
    width: 80rpx;
    height: 80rpx;
    position: absolute;
    top: 0;
    right: 0;
  }
  .xx-card-qrcode {
    width: 300rpx;
    height: 300rpx;
  }
}
</style>
