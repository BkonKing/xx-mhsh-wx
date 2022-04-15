<template>
  <view class="recom-buy-house">
    <view class="top">
      <uni-nav-bar
        :fixed="true"
        :border="false"
        statusBar="true"
        color="#ca864e"
        backgroundColor="#fadbbe"
        left-icon="left"
        right-text="记录"
        @click-left="$router.go(-1)"
      />
      <image class="recom-img" src="@/static/main/recom-happyicon.png" alt="" />
      <view class="title">
        <view class="left">
          <view class="line"></view>
          <view class="line"></view>
          <view class="line"></view>
        </view>
        <view class="mid">三步流程轻松赚</view>
        <view class="right">
          <view class="line"></view>
          <view class="line"></view>
          <view class="line"></view>
        </view>
      </view>
      <view class="step">
        <view class="c1">1</view>
        <view class="line1"></view>
        <view class="c2">2</view>
        <view class="line2"></view>
        <view class="c3">3</view>
        <view class="poiter"></view>
      </view>
      <view class="titleItem">
        <view class="t1">推荐小伙伴</view>
        <view class="t2">看房、购房</view>
        <view class="t3">获得奖励</view>
      </view>
      <view class="midCon">
        <uni-list :border="false">
          <uni-list-item direction="row">
            <template #header>
              <view class="title2">
                朋友姓名
                <text style="color:red">*</text>
              </view>
            </template>
            <template #footer>
              <input class="text-right" v-model="friedName" maxlength="10" />
            </template>
          </uni-list-item>
          <uni-list-item direction="row">
            <template #header>
              <view class="title2">
                手机号
                <text style="color:red">*</text>
              </view>
            </template>
            <template #footer>
              <input
                class="text-right"
                v-model="phone"
                type="number"
                maxlength="11"
              />
            </template>
          </uni-list-item>
          <uni-list-item
            direction="row"
            showArrow="true"
            :clickable="true"
            :rightText="houseInfo.project"
            @click="show = true"
          >
            <template #header>
              <view class="title2">
                楼盘名称
                <text style="color:red">*</text>
              </view>
            </template>
          </uni-list-item>
        </uni-list>
      </view>
    </view>
    <view v-if="houseInfo !== ''" class="awardInfo">
      奖励：{{ houseInfo.credits }}幸福币 (朋友到访{{
        houseInfo.credits_df
      }},购房{{ houseInfo.credits_gf }})
    </view>
    <!-- 楼盘名称弹出层 -->
    <select-project v-model="show" @confirm="setProject"></select-project>

    <view class="confirm">
      <view
        class="record-url"
        @click="goRecomRecord"
      >
        <text>推荐记录</text>
        <uni-icons type="right" size="12"></uni-icons>
      </view>
      <button
        :class="{ 'tf-btn-primary': bol }"
        :disabled="!bol"
        @click="submit"
      >
        确认提交
      </button>
    </view>
  </view>
</template>

<script>
import SelectProject from './components/SelectProject';
import { getYxlpList, recommendClient } from '@/api/personage.js';
export default {
  components: {
    SelectProject
  },
  data() {
    return {
      show: false,
      houseInfo: '', // 楼盘信息
      friedName: '',
      phone: ''
    };
  },
  computed: {
    bol() {
      return (
        this.houseInfo !== '' && this.friedName !== '' && this.phone !== ''
      );
    }
  },
  // async onLoad() {
  //   const res = await getYxlpList();
  //   this.yxlpList = res.data;
  // },
  methods: {
    setProject(data) {
      this.houseInfo = data;
    },
    goRecomRecord() {
      this.$router.push('/pages/credit/recomRecord');
    },
    // 确认提交
    async submit() {
      const res = await recommendClient({
        alias: this.houseInfo.alias,
        clientName: this.friedName,
        clientMobile: this.phone,
        yxlpId: +this.houseInfo.yxlpId,
        project: this.houseInfo.project
      });
      // 提交成功
      if (res.success) {
        uni.showToast({
          title: '提交成功',
          icon: 'success'
        });
        this.$router.go(-1);
      } else {
        // 提交失败
        uni.showToast({
          title: '提交失败，请重试',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.recom-buy-house {
  .top {
    height: 660rpx;
    background-color: #fadbbe;

    .recom-img {
      display: block;
      width: 423rpx;
      height: 66rpx;
      margin: 40rpx auto;
    }

    .title {
      display: flex;
      align-items: center;
      justify-content: center;

      .line {
        width: 60rpx;
        height: 1rpx;
        background-color: #ca864e;

        &:nth-child(2) {
          margin: 5rpx 0;
        }
      }

      .mid {
        margin: 0 60rpx;
        font-size: 26rpx;
        color: #ca864e;
        line-height: 52rpx;
      }
    }

    .step {
      margin-top: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .c1 {
        left: 90rpx;
        width: 88rpx;
        height: 88rpx;
        background: linear-gradient(180deg, #fec98b, #fe8a44);
        border-radius: 50%;
        border: 10rpx solid #fff;

        font-size: 34rpx;
        font-weight: 600;
        color: #ffffff;
        text-align: center;
        line-height: 65rpx;
      }

      .poiter {
        position: absolute;
        top: 100rpx;
        left: 110rpx;
        width: 0;
        height: 0;
        border-left: 10rpx solid transparent;
        border-right: 10rpx solid transparent;
        border-top: 10rpx solid #fe8a45;
      }

      .c2,
      .c3 {
        width: 88rpx;
        height: 88rpx;
        border-radius: 50%;
        background-color: #fff;
        border: 10rpx solid #fff;

        font-size: 34rpx;
        font-weight: 600;
        color: #fadbbe;
        text-align: center;
        line-height: 65rpx;
      }

      .c2 {
        margin: 0 170rpx;
      }

      .line1 {
        position: absolute;
        top: 30rpx;
        left: 160rpx;
        width: 180rpx;
        height: 25rpx;
        background-color: #fff;
      }

      .line2 {
        position: absolute;
        top: 30rpx;
        left: 400rpx;
        width: 190rpx;
        height: 25rpx;
        background-color: #fff;
      }
    }

    .titleItem {
      display: flex;
      align-items: center;
      margin-top: 44rpx;

      .t1 {
        flex: 1;
        text-align: center;
        font-size: 34rpx;
        font-weight: 500;
        color: #7f532f;
        line-height: 52rpx;
      }

      .t2,
      .t3 {
        flex: 1;
        text-align: center;
        font-size: 26rpx;
        font-weight: 400;
        color: #ca864e;
        line-height: 52rpx;
      }
    }

    .midCon {
      width: 670rpx;
      height: 358rpx;
      margin: 20rpx auto 0;
      background: #ffffff;
      border-radius: 10rpx;
      overflow: hidden;
      padding: 0 30rpx;

      ::v-deep .uni-list-item__container {
        padding: 38rpx 0;
      }

      .title2 {
        color: #8f8f94;

        .houseName {
          color: #222222;
          padding-left: 60rpx;
        }
      }
    }
  }

  .awardInfo {
    width: 670rpx;
    height: 88rpx;
    margin: 335rpx auto 0;
    background: #f1e2e2;
    border-radius: 10rpx;

    font-size: 28rpx;
    color: #eb5841;
    line-height: 88rpx;
    text-align: center;
  }

  .text-right {
    text-align: right;
  }
  
  .record-url {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 20rpx;
    margin-bottom: 20rpx;
    font-size: 24rpx;
    color: $gray-7;
  }

  .confirm {
    position: fixed;
    bottom: calc(30rpx + env(safe-area-inset-bottom));
    bottom: calc(30rpx + constant(safe-area-inset-bottom));
    left: 0;
    width: 100%;

    button {
      width: 710rpx;
      margin: 0 auto;
    }
  }
}
</style>
