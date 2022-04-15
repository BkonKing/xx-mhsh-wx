<template>
  <view class="recom-record">
    <view class="top">
      <uni-nav-bar
        title="推荐记录"
        statusBar="true"
        left-icon="left"
        color="#ca864e"
        backgroundColor="#fadbbe"
        :fixed="true"
        :border="false"
        @click-left="$router.go(-1)"
      />
      <view class="count">
        <view class="count-item">
          <view class="t1">{{ clientInfo.ljtjNum || 0 }}</view>
          <view class="t2">累计推荐人数</view>
        </view>
        <view class="line"></view>
        <view class="count-item">
          <view class="t1">{{ clientInfo.ljjlCredits || 0 }}</view>
          <view class="t2">已奖励幸福币</view>
        </view>
      </view>
    </view>
    <view class="content">
      <uni-list class="tf-uni-list">
        <uni-list-item
          v-for="(item, index) in listData"
          :key="index"
          direction="row"
          clickable
          :title="item.clientName"
          :note="item.yxlpName"
          @click="openDetail(item)"
        >
          <template #footer>
            <view class="tf-column-justify-center ">
              <view v-if="item.ydfCredits !== 0" class="text">
                已到访
                <text>+{{ item.ydfCredits }}</text>
              </view>
              <view v-if="item.ygfCredits !== 0" class="text">
                已购房
                <text>+{{ item.ygfCredits }}</text>
              </view>
            </view>
          </template>
        </uni-list-item>
      </uni-list>
      <uni-load-more :status="loadMoreStatus" />
    </view>
    <tf-popup v-model="isShow" class="popup">
      <view class="recom-popup-content">
        <view class="title">详情</view>
        <view class="info">
          <view class="tf-flex-row tf-mb-20">
            <view class="label">客户姓名：</view>
            <text>{{ currentClient.clientName }}</text>
          </view>
          <view class="tf-flex-row tf-mb-20">
            <view class="label">手机号：</view>
            <text>{{ currentClient.clientMobile }}</text>
          </view>
          <view class="tf-flex-row tf-mb-20">
            <view class="label">楼盘：</view>
            <text>{{ currentClient.yxlpName }}</text>
          </view>
          <view class="tf-flex-row tf-mb-20">
            <view class="label">预计奖励：</view>
            <view class="tf-flex-col">
              <view class="tf-text-color">
                {{ currentClient.yjjlCredits }}幸福币
              </view>
              <view class="tf-text-color">
                (
                <template v-if="yjdfjlCredit !== 0">
                  到访{{ yjdfjlCredit }}，
                </template>
                购房{{ yjgfjlCredit }}）
              </view>
            </view>
          </view>
          <view
            v-if="ydfCredit !== 0 || ygfCredit !== 0"
            class="tf-flex-row tf-mb-20"
          >
            <view class="label">实际奖励：</view>
            <view class="tf-flex-col">
              <view class="tf-text-color" style="color:#EB5841">
                {{ ydfCredit + ygfCredit }}幸福币
              </view>
              <view class="tf-text-color">
                (到访{{ ydfCredit }}
                <text v-if="ygfCredit !== 0">，购房{{ ygfCredit }}</text>
                ）
              </view>
            </view>
          </view>
        </view>
        <view class="steps">
          <view class="left tf-mr-20">
            <view style="line-height: 1;">
              <text class="tf-icon tf-icon-gouxuan active"></text>
            </view>
            <view class="line" :class="{ activeBg: ydfCredit !== 0 }"></view>
            <template v-if="isHaveVisitCredit">
              <view>
                <text
                  v-if="ydfCredit !== 0"
                  class="tf-icon tf-icon-gouxuan active"
                ></text>
                <view class="cir" v-else></view>
              </view>
              <view class="line" :class="{ activeBg: ygfCredit !== 0 }"></view>
            </template>
            <view>
              <text
                v-if="ygfCredit !== 0"
                class="tf-icon tf-icon-gouxuan active"
              ></text>
              <view class="cir" v-else></view>
            </view>
          </view>
          <view class="right">
            <view class="step-text">
              <text>{{ currentClient.tjTime }}</text>
              <text>推荐客户</text>
            </view>
            <view v-if="isHaveVisitCredit" class="step-text">
              <text v-if="currentClient.dfTime !== ''">
                {{ currentClient.dfTime }}
              </text>
              <text>客户到访</text>
              <text v-if="ydfCredit !== 0">+{{ ydfCredit }}</text>
            </view>
            <view class="step-text">
              <text v-if="currentClient.gfjl_time !== ''">
                {{ currentClient.gfjl_time }}
              </text>
              <text>客户购房</text>
              <text v-if="ygfCredit !== 0" class="tf-text-primary">
                +{{ ygfCredit }}
              </text>
            </view>
          </view>
        </view>
        <text class="tf-icon tf-icon-guanbi1" @click="isShow = false"></text>
      </view>
    </tf-popup>
  </view>
</template>

<script>
import TfPopup from '@/components/TfPopup/index';
import ListMixins from '@/mixins/list';
import { clientList, clientCount } from '@/api/personage.js';

export default {
  mixins: [ListMixins],
  components: {
    TfPopup
  },
  data() {
    return {
      clientInfo: {}, // 客户统计信息
      currentClient: {}, // 当前点击的推荐客户
      isShow: false
    };
  },
  computed: {
    // 预计到访奖励幸福币
    yjdfjlCredit() {
      return +this.currentClient.yjdfjlCredits;
    },
    // 预计购房奖励幸福币
    yjgfjlCredit() {
      return +this.currentClient.yjgfjlCredits;
    },
    // 已购房幸福币
    ygfCredit() {
      return +this.currentClient.ygfCredits;
    },
    // 已到访幸福币
    ydfCredit() {
      return +this.currentClient.ydfCredits;
    },
    isHaveVisitCredit() {
      return this.yjdfjlCredit !== 0;
    }
  },
  onLoad() {
    this.getClientCount();
  },
  onPullDownRefresh() {
    this.getClientCount();
  },
  methods: {
    async getClientCount() {
      const res = await clientCount();
      this.clientInfo = res;
    },
    getListData() {
      return clientList({
        pages: this.pageNum
      });
    },
    openDetail(data) {
      this.isShow = true;
      this.currentClient = data;
    }
  }
};
</script>

<style lang="scss" scoped>
.recom-record {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f2f2f4;

  .top {
    padding-bottom: 100rpx;
    background-color: #fadbbe;

    .count {
      display: flex;
      align-items: center;
      text-align: center;
      margin-top: 50rpx;

      .count-item {
        flex: 1;

        .t1 {
          font-size: 72rpx;
          font-weight: 600;
          line-height: 72rpx;
          color: #ca864e;
        }

        .t2 {
          font-size: 26rpx;
          color: #ca864e;
          line-height: 72rpx;
          opacity: 0.8;
        }
      }

      .line {
        width: 2rpx;
        height: 80rpx;
        background: #ca864e;
        border-radius: 1rpx;
      }
    }
  }

  .content {
    width: 710rpx;
    padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
    padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
    margin: 0 auto;
    margin-top: -70rpx;
    border-radius: 10rpx;
    .text {
      font-size: 26rpx;
      color: #8f8f94;
      text {
        margin-left: 10rpx;
        color: #eb5841;
      }
    }
  }

  .recom-popup-content {
    width: 620rpx;
    padding: 0 50rpx;
    padding-bottom: 35rpx;
    .tf-icon-guanbi1 {
      position: absolute;
      right: 30rpx;
      top: -80rpx;
      z-index: 99999;
      font-size: 50rpx;
      color: #fff;
    }
    .title {
      height: 118rpx;
      font-size: 30rpx;
      font-weight: 600;
      color: #000000;
      line-height: 118rpx;
      text-align: center;
      border-bottom: 3rpx solid #f0f0f0;
    }
    .info {
      margin-top: 38rpx;
      font-size: 26rpx;
      color: #8f8f94;
      text {
        color: #222222;
      }
      .label {
        width: 150rpx;
      }
    }
    .steps {
      padding: 30rpx;
      margin-top: 26rpx;
      background-color: #f0f0f0;
      font-size: 26rpx;
      border-radius: 10rpx;
      .left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        float: left;
        position: relative;
        .cir {
          width: 36rpx;
          height: 36rpx;
          background: #aaaaaa;
          border-radius: 50%;
        }
        .active {
          color: #ffa110;
        }
        .activeBg {
          background-color: #ffa110 !important;
        }
        .line {
          width: 4rpx;
          height: 70rpx;
          background: #aaaaaa;
          border-radius: 2rpx;
        }
      }
      .step-text {
        text {
          font-size: 26rpx;
        }
        text:first-child {
          margin-left: 20rpx;
          color: #8f8f94;
        }
        text:nth-child(2) {
          margin-left: 20rpx;
          margin-right: 10rpx;
          color: #222222;
        }
      }
      .step-text + .step-text {
        margin-top: 66rpx;
      }
    }
    .tf-icon-gouxuan {
      font-size: 36rpx;
    }
  }
}
</style>
