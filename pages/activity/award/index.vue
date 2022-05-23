<template>
  <view>
    <uni-nav-bar
      :title="title"
      statusBar="true"
      left-icon="left"
      backgroundColor="#52ccfa"
      :fixed="true"
      :border="false"
      @click-left="$router.go(-1)"
    />
    <image
      class="bg"
      :src="`${baseUrl}/library/img/wx/award/index-bg.png`"
      mode="aspectFill"
    ></image>
    <view class="user-info-container" @click="goCredit">
      <image
        class="user-info-bg"
        :src="`${baseUrl}/library/img/wx/award/user-bg.png`"
      ></image>
      <image
        v-if="userInfo.avatar"
        class="user-info-avatar"
        :src="userInfo.avatar"
      ></image>
      <image v-else class="user-info-avatar" src="@/static/main/touxiang.png" />
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
        :src="`${baseUrl}/library/img/wx/award/turntable-bn-2.png`"
        mode="aspectFill"
      ></image>
      <view class="award-text-1">{{ infoData.award_text || '-' }}</view>
      <view class="award-text-2">今天还有 {{ residueNum }} 次机会</view>
      <view class="award-box">
        <image
          class="award-box-bg"
          :src="`${baseUrl}/library/img/wx/award/turntable-bg-1.png`"
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
              <view class="award-image-box" :style="noImageTextStyle">
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
          :src="`${baseUrl}/library/img/wx/award/start-btn.png`"
          mode="aspectFill"
          @click="handlePlay"
        ></image>
      </view>
    </view>
    <view class="award-explain-container">
      <image
        class="award-explain-title-image"
        :src="`${baseUrl}/library/img/wx/award/title.png`"
        mode="aspectFill"
      ></image>
      <view class="award-explain-content">
        <rich-text
          class="award-explain-text"
          :nodes="activityExplain.replace(/\r\n|\n/g, '<br/>')"
        ></rich-text>
      </view>
    </view>
    <tf-dialog
      v-model="visible"
      confirmText="知道了"
      closeIconType="hidden"
      :title="popupTitle"
      :isCompact="true"
      :isMaskClick="isMaskClick"
      :headerBorder="false"
      :showCancel="showCancel"
      @confirm="handleConfirm"
    >
      <view class="tf-text-align-center tf-p-30">
        <rich-text :nodes="popupContent"></rich-text>
      </view>
    </tf-dialog>
  </view>
</template>

<script>
import apiConfig from '@/api/config.js';
import { mapGetters } from 'vuex';
import { getAwardInfo, luckDraw } from '@/api/award.js';
import TfDialog from '@/components/TfDialog/index';

export default {
  components: {
    TfDialog
  },
  data() {
    return {
      baseUrl: apiConfig.baseUrl,
      id: '', // 预览
      infoData: {},
      awardList: [],
      run: false, // 是否在转动
      activeIndex: 0, // 中奖索引 转盘图片排序 顺时针开始
      activeMessage: '',
      rotateAngle: 0, // 旋转角度
      width: 500,
      config: {
        duration: 8000, // 总旋转时间 ms级
        mode: 'ease-in-out', // 由快到慢 惯性效果都省了
        circle: 12 // 旋转圈数
      },
      visible: false,
      popupTitle: '',
      popupContent: '',
      handleConfirm: '',
      showCancel: false,
      isMaskClick: false
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    title() {
      return this.infoData.title || '转盘抽奖';
    },
    residueNum() {
      const num = +this.infoData.chance_num;
      return num > 0 ? num : 0;
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
    allRotateStyle() {
      return `${this.run ? this.rotateStyle : ''}`;
    },
    isHaveImage() {
      return this.awardList.some(obj => obj.img);
    },
    noImageTextStyle() {
      // PY：偏移，DB：底边
      // 半径
      const radius = this.width / 2;
      // 文字旋转角度，将其旋转成正的
      const textDeg = this.rotateDeg / 2;
      // 直角三角形另一个角
      const bDeg = 90 - textDeg;
      // 第三边对应的sin值
      const sinOther = Math.sin(((2 * Math.PI) / 360) * bDeg);
      // 扇形圆心角一半角对应的sin值
      const sinTextDeg = Math.sin(((2 * Math.PI) / 360) * textDeg);
      // 直角对应的sin值,值为1
      const sinZhijiao = Math.sin(((2 * Math.PI) / 360) * 90);
      // 一半的扇形弧线两点直线距离（底边的一半）
      // 这个三角形为圆心到底边、一半底边和一条半径组成的直角三角形
      const halfDB = sinTextDeg * (radius / sinZhijiao);
      // 文本框的宽度
      const width = halfDB * 2;
      const textWidth = 24;

      // 实际移动距离（斜边）：和偏移量形成的直角三角形来计算
      function getRealityNum(value) {
        return (value / sinOther) * sinZhijiao;
      }

      // 文本框旋转到居中,原本的文本框跟随扇形会产生偏移，宽度不是实际宽度
      // 旋转后宽度会变小，所以产生left偏移量，左右两边移动时只需计算一边，所以除以2
      var textPYWidth =
        (width * Math.cos(((2 * Math.PI) / 360) * textDeg) +
          radius * sinTextDeg -
          width) /
        2;
      // 实际移动距离（斜边）：和偏移量形成的直角三角形来计算
      textPYWidth = getRealityNum(textPYWidth);

      // 圆心到底边的直角边：和半径、底边一半组成直角三角形
      var top = sinOther * (radius / sinZhijiao);
      // 定位top最小值：半径 - 圆心到底边的直角边
      top = getRealityNum(radius - top);
      top = Math.ceil(top);
      top = (top % 2) + top;
      var left = sinTextDeg * (top / sinZhijiao);
      left = textPYWidth + left;
      left = Math.ceil(left);
      left = (left % 2) + left;
      const transformStyle = `transform: translateX(-${left}rpx) translateY(${top}rpx) rotate(${textDeg}deg);`;
      if (this.isHaveImage) {
        // 图片模式：文本框宽度与底边宽度一样，并且是居中显示，所以只要旋转一下，位移调整一下位置就行
        return `${transformStyle}width: ${width}rpx;`;
      } else {
        // 将宽度设置得跟底边一样长，内容宽度为字体宽度，通过padding来只显示一行，则跟图片模式一样
        var padding = (width - textWidth) / 2;
        return `${transformStyle}width: ${width}rpx;padding: 0 ${padding}rpx;height: ${radius}rpx;`;
      }
    }
  },
  onLoad({ id }) {
    id && (this.id = id);
  },
  onShow() {
    this.getAwardInfo();
  },
  methods: {
    async getAwardInfo() {
      const { data, award_list } = await getAwardInfo({
        project_id: this.id
      });
      if (+data.state === 1 || this.id) {
        this.infoData = data;
        this.awardList = award_list || [];
      } else {
        this.setPopup({
          content: '活动已结束',
          isMaskClick: false,
          success: () => {
            this.$router.go(-1);
          }
        });
      }
    },
    // 开始转动
    handlePlay() {
      if (+this.rotateAngle > 0 || this.id) {
        return;
      }
      if (+this.infoData.chance_num < 1) {
        this.setPopup({
          content: '您今天已经没有抽奖机会了<br/>明天再来吧'
        });
        return;
      }
      if (!+this.infoData.consume || +this.infoData.remaining_free > 0) {
        this.startPlay();
        return;
      }
      this.setPopup({
        content: `使用${this.infoData.consume}幸福币抽奖`,
        showCancel: true,
        success: () => {
          this.startPlay();
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
        this.setPopup({
          content: message || '请求失败，请稍后重试'
        });
      });
      const index = this.awardList.findIndex(obj => {
        return obj.id == award_id;
      });
      this.activeIndex = index;
      this.activeMessage = message;
    },
    // 完成旋转之后,弹起弹框
    async finishRotate() {
      const data = this.awardList[this.activeIndex];
      const isFail = +data.award_type === 5;
      this.setPopup({
        title: isFail ? '' : '中奖啦',
        content: this.activeMessage,
        success: () => {
          this.run = false;
          this.rotateAngle = 0;
          this.getAwardInfo();
        }
      });
    },
    setPopup({
      title = '',
      content = '',
      showCancel = false,
      isMaskClick = true,
      success
    }) {
      this.popupTitle = title;
      this.popupContent = content;
      this.showCancel = showCancel;
      this.isMaskClick = isMaskClick;
      this.handleConfirm = () => {
        this.visible = false;
        success && success();
      };
      this.visible = true;
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
    border-radius: 44rpx;
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
    .award-no-img .award-name {
      position: absolute;
      left: 0;
      top: 0;
      width: 24rpx;
      height: 110rpx;
      overflow: initial;
      text-overflow: initial;
      white-space: initial;
      word-break: break-all;
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
      transform: translateX(-250rpx);
      transform-origin: right center;
      border-radius: 250rpx 0 0 250rpx;
      background: linear-gradient(
        90deg,
        rgba(255, 202, 104, 0.6) 0%,
        rgba(255, 247, 232, 0) 100%
      );
    }
    .award-image-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 250rpx;
      position: absolute;
      top: 0;
      left: 0;
      .award-name {
        width: 100%;
        padding: 0px 20rpx;
        text-align: center;
      }
    }
    .award-name {
      display: block;
      transform-origin: center;
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
    }
    .award-btn {
      width: 189rpx;
      height: 217rpx;
      position: absolute;
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
