<template>
  <view>
    <uni-nav-bar
      :title="title"
      statusBar="true"
      left-icon="left"
      backgroundColor="false"
      :fixed="true"
      :border="false"
      @click-left="$router.go(-1)"
    />
    <image
      class="bg"
      src="@/static/main/award/index-bg.png"
      mode="aspectFill"
    ></image>
    <view class="user-info-container" @click="goCredit">
      <image class="user-info-bg" src="@/static/main/award/user-bg.png"></image>
      <image class="user-info-avatar" :src="userInfo.avatar"></image>
      <view class="user-info-box">
        <view class="tf-mb-20">
          <text class="tf-icon tf-icon-xingfubi1"></text>
          <text class="word1">{{ infoData.credits }}</text>
        </view>
        <text class="word2">
          可用{{ infoData.ky_credits || 0 }}&nbsp;&nbsp;不可用{{
            infoData.sd_credits || 0
          }}
        </text>
      </view>
      <view class="user-info-right" @click.stop="goRecord">
        <text lines="1" class="word2 tf-mr-10">抽奖记录</text>
        <uni-icons type="right" size="14" color="#222"></uni-icons>
      </view>
    </view>
    <view class="award-container">
      <image
        class="award-container-bg"
        src="@/static/main/award/turntable-bn-2.png"
        mode="aspectFill"
      ></image>
      <view class="award-text-1">{{ infoData.award_text || '-' }}</view>
      <view class="award-text-2">
        今天还有 {{ infoData.chance_num }} 次机会
      </view>
      <view class="award-box">
        <image
          class="award-box-bg"
          src="@/static/main/award/turntable-bg-1.png"
          mode="aspectFill"
        ></image>
        <view
          class="award-circle"
          :class="{ 'award-no-img': !isHaveImage }"
          :style="allRotateStyle"
          @transitionend="finishRotate"
        >
          <view
            v-for="(item, index) in awardList"
            :key="index"
            class="award-item"
            :style="{
              transform: `rotate(${rotateDeg * index}deg)`
            }"
          >
            <view
              class="award-item-inner"
              :style="{
                transform: `translateX(-250rpx) rotate(${360 / len}deg)`
              }"
            ></view>
            <template v-if="isHaveImage">
              <view class="dingwei" :style="noImageTextStyle">
                <text class="award-name">{{ item.award_name }}</text>
                <image
                  :src="item.img"
                  class="award-image"
                  mode="widthFix"
                ></image>
              </view>
            </template>
            <view
              v-if="!isHaveImage"
              class="award-name"
              :style="noImageTextStyle"
            >
              {{ item.award_name }}
            </view>
          </view>
        </view>
        <image
          class="award-btn"
          src="@/static/main/award/start-btn.png"
          mode="aspectFill"
          @click="handlePlay"
        ></image>
      </view>
    </view>
    <view class="award-explain-container">
      <image
        class="award-explain-title-image"
        src="@/static/main/award/title.png"
        mode="aspectFill"
      ></image>
      <view class="award-explain-content">
        <rich-text
          class="award-explain-text"
          :nodes="activityExplain.replace(/\r\n|\n/g, '<br/>')"
        ></rich-text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import { getAwardInfo, luckDraw } from '@/api/award.js';
export default {
  data() {
    return {
      infoData: {},
      awardList: [],
      run: false, // 是否在转动
      activeIndex: 0, // 中奖索引 转盘图片排序 顺时针开始
      activeMessage: '',
      rotateAngle: 0, // 旋转角度
      config: {
        duration: 7000, // 总旋转时间 ms级
        mode: 'ease-in-out', // 由快到慢 惯性效果都省了
        circle: 12 // 旋转圈数
      }
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    title() {
      return this.infoData.title || '转盘抽奖';
    },
    activityExplain() {
      return this.infoData.explain || '';
    },
    len() {
      return this.awardList.length || 0;
    },
    rotateDeg() {
      return this.len ? 360 / this.len : 0;
    },
    rotateStyle() {
      const config = this.config;
      return `
            -webkit-transition: transform ${config.duration}ms ${config.mode};
            transition: transform ${config.duration}ms ${config.mode};
            -webkit-transform: rotate(${this.rotateAngle}deg);
                transform: rotate(${this.rotateAngle}deg);`;
    },
    normalRotateStyle() {
      return `transform: rotate(${this.normalRotateAngle}deg);`;
    },
    allRotateStyle() {
      return `${this.normalRotateStyle} ${this.run ? this.rotateStyle : ''}`;
    },
    isHaveImage() {
      return this.awardList.some(obj => obj.img);
    },
    noImageTextStyle() {
      return `${this.noImageTextLeft}`;
    },
    noImageTextLeft() {
      // 文字旋转角度，将其旋转成正的
      var textDeg = this.rotateDeg / 2;
      var bDeg = 90 - textDeg;
      var height = this.isHaveImage ? 250 : 110;
      // 第三边对应的sin值
      var sinOther = Math.sin(((2 * Math.PI) / 360) * bDeg);
      // 扇形圆心角一半角对应的sin值
      var sinTextDeg = Math.sin(((2 * Math.PI) / 360) * textDeg);
      // 直角对应的sin值,值为1
      var sinZhijiao = Math.sin(((2 * Math.PI) / 360) * 90);
      // 一半的扇形底边三角的长
      var hudi = sinTextDeg * (250 / sinZhijiao);
      var width = this.isHaveImage ? (hudi * 2) : 24;

      // 旋转后的偏移量
      var a =
        (width * Math.cos(((2 * Math.PI) / 360) * textDeg) +
          height * sinTextDeg -
          width) /
        2;
      a = (a / sinOther) * sinZhijiao;

      // 一半的扇形底边三角的长 减去 文字本身宽度的一半
      var b = hudi - width / 2;

      if (this.isHaveImage) {
        var j = sinOther * (250 / sinZhijiao);
        // 定位top最小值
        var topLen = ((250 - j) / sinOther) * sinZhijiao;
        c = sinTextDeg * (topLen / sinZhijiao)
        return `transform: translateX(-${a + c}rpx) translateY(${topLen}rpx) rotate(${this.rotateDeg /
          2}deg);width: ${hudi * 2}rpx;left: 0;top: 0;`;
      }

      // 实际移动应该为一半边组成直角三角形的斜边
      var d = (b / sinOther) * sinZhijiao - a;

      console.log('d:', d);

      var firstTop = (d / sinZhijiao) * sinTextDeg;
      // 有旋转如果也会产生偏移量，实际移动的值应该为斜边
      var topLen = (firstTop / sinOther) * sinZhijiao;

      // 底边到圆弧最长点的距离
      // var j = sinOther * (250 / sinZhijiao);
      // 定位top最小值
      // var topLen = ((250 - j) / sinOther) * sinZhijiao;

      // topLen = firstTop + topLen

      var c = 0;
      var topb = topLen;
      // 加入top定位，会产生left向右的偏移量
      while (topb > 1 || topb < 0) {
        c = sinTextDeg * (topb / sinZhijiao);

        c = (c / sinOther) * sinZhijiao;

        d = d - c;

        topb = -(((c / sinZhijiao) * sinTextDeg) / sinOther) * sinZhijiao;

        topLen = topLen + topb;
        console.log('topb:', topb);
      }

      var f = Math.ceil(d);

      var left = (f % 2) + f;

      var result = `transform: rotate(${this.rotateDeg /
        2}deg);left: ${left}rpx;top: ${topLen}rpx;`;

      return result;
    }
  },
  onLoad() {
    this.getAwardInfo();
  },
  methods: {
    async getAwardInfo() {
      const { data, award_list } = await getAwardInfo();
      if (+data.state === 1) {
        this.infoData = data;
        this.awardList = award_list || [];
      } else {
        uni.showModal({
          content: '活动已结束',
          showCancel: false,
          confirmText: '知道了',
          success: res => {
            if (res.confirm) {
              this.$router.go(-1);
            }
          }
        });
      }
    },
    // 开始转动
    handlePlay() {
      if (+this.rotateAngle > 0) {
        return;
      }
      if (+this.infoData.chance_num < 1) {
        uni.showModal({
          content: '您今天已经没有抽奖机会了明天再来吧',
          showCancel: false,
          confirmText: '知道了',
          success: res => {
            if (res.confirm) {
            }
          }
        });
        return;
      }
      if (!+this.infoData.consume) {
        this.startPlay();
        return 
      }
      uni.showModal({
        content: `使用${this.infoData.consume}幸福币抽奖`,
        success: ({ confirm }) => {
          if (confirm) {
            this.startPlay();
          }
        }
      });
    },
    async startPlay() {
      await this.luckDraw();
      this.run = true;
      this.rotateAngle =
        this.config.circle * 360 -
        (this.activeIndex * this.rotateDeg + this.rotateDeg / 2);
    },
    async luckDraw() {
      const { award_id, message } = await luckDraw().catch(({ message }) => {
        uni.showModal({
          content: message,
          showCancel: false,
          confirmText: '知道了'
        });
      });
      const index = this.awardList.findIndex(obj => {
        return obj.id == award_id;
      });
      console.log(index);
      this.activeIndex = index;
      this.activeMessage = message;
    },
    // 完成旋转之后,弹起弹框
    async finishRotate() {
      await this.sleep(1000);
      uni.showModal({
        content: this.activeMessage,
        showCancel: false,
        success: res => {
          this.run = false;
          this.rotateAngle = 0;
          this.getAwardInfo();
        }
      });
    },
    // 等待n秒之后再弹
    sleep(time) {
      return new Promise(function(resolve) {
        setTimeout(resolve, time);
      });
    },
    goCredit() {
      this.$router.push({
        path: '/pages/credit/creditRecord'
      });
    },
    goRecord() {
      this.$router.push({
        path: '/pages/activity/award/record'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.bg {
  width: 750rpx;
  height: 1047rpx;
  position: absolute;
  top: 0;
  z-index: -1;
}

.user-info-container {
  display: flex;
  width: 690rpx;
  height: 168rpx;
  padding: 40rpx 30rpx;
  margin: 30rpx;
  border-radius: 20rpx;
  position: relative;
  .user-info-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .user-info-avatar {
    width: 88rpx;
    height: 88rpx;
  }
  .user-info-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 166rpx;
    height: 36rpx;
    padding-bottom: 10rpx;
    padding-left: 30rpx;
  }
  .word2 {
    line-height: 24rpx;
    font-size: 24rpx;
    color: #222222;
  }
}
.user-info-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  margin-left: 30rpx;
  .tf-icon-xingfubi1 {
    margin-right: 12rpx;
    font-size: 34rpx;
    color: #febf00;
  }
  .word1 {
    font-size: 36rpx;
    line-height: 36rpx;
    color: #222222;
  }
}
.award-container {
  width: 750rpx;
  height: 976rpx;
  position: relative;
  .award-container-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .award-text-1 {
    padding: 20rpx 0;
    font-size: 24rpx;
    line-height: 24rpx;
    color: #9b4004;
    text-align: center;
  }
  .award-text-2 {
    padding: 30rpx;
    margin-top: 40rpx;
    font-size: 28rpx;
    line-height: 28rpx;
    font-weight: bold;
    color: #ffffff;
    text-align: center;
  }
  .award-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 640rpx;
    height: 640rpx;
    margin-top: 16rpx;
    margin-left: 55rpx;
    position: relative;
    .award-box-bg {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }
    .award-circle {
      position: relative;
      height: 500rpx;
      width: 500rpx;
      border-radius: 72rpx;
    }
    .award-no-img {
      .award-name {
        position: absolute;
        left: 60rpx;
        top: 20rpx;
        width: 24rpx;
        height: 110rpx;
        overflow: initial;
        text-overflow: initial;
        white-space: initial;
        word-break: break-all;
      }
    }
    .award-btn {
      width: 189rpx;
      height: 217rpx;
      position: absolute;
    }
    .award-item {
      position: absolute;
      left: 250rpx;
      top: 0;
      width: 250rpx;
      height: 500rpx;
      border-radius: 0 250rpx 250rpx 0;
      overflow: hidden;
      transform-origin: left center;
    }
    .award-item-inner {
      width: 250rpx;
      height: 500rpx;
      // padding: 20rpx 10rpx 0 140rpx;
      transform: translateX(-250rpx);
      transform-origin: right center;
      border-radius: 250rpx 0 0 250rpx;
      // background: #fff;
      text-align: center;
      background: linear-gradient(
        90deg,
        rgba(255, 202, 104, 0.6) 0%,
        rgba(255, 247, 232, 0) 100%
      );
    }
    .dingwei {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 250rpx;
      position: absolute;
      .award-name {
        width: 100%;
        padding: 0px 20rpx;
        text-align: center;
      }
    }
    .award-name {
      display: block;
      transform-origin: center;
      // transform: rotate(-19deg);
      font-size: 24rpx;
      color: #222222;
      @include text-ellipsis;
    }
    .award-image {
      width: 50%;
      max-width: 72rpx;
      max-height: 72rpx;
      // height: 72rpx;
      margin-top: 20rpx;
      border-radius: 50%;
      image {
      }
    }
  }
}
.award-explain-container {
  width: 750rpx;
  padding: 12rpx 30rpx 50rpx;
  position: relative;
  background: #ff4e33;
  .award-explain-title-image {
    width: 274rpx;
    height: 74rpx;
    position: absolute;
    top: -14rpx;
    left: 238rpx;
  }
  .award-explain-content {
    width: 100%;
    padding: 50rpx 30rpx;
    background: #db1e03;
    border-radius: 10rpx;
    font-size: 26rpx;
    color: #fff;
  }
}
</style>
